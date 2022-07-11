import axios from 'axios';

import Database from '/plugins/database/server';
import Migrations from '/plugins/migrations/server';
import Entrypoint from '/plugins/entrypoint/server';

import { route } from '/libs/utils';
import { createJWT, readJWT } from './security';

/* GITHUB API CALLS */

const CLIENT_ID = String(process.env.GH_CLIENT_ID);
const CLIENT_SECRET = String(process.env.GH_CLIENT_SECRET);

const exchangeCode = async ({ code }: { code: string }) => {
  return axios.post('https://github.com/login/oauth/access_token', {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: code,
  }, { headers: { 'Accept': 'application/json' } }).then(({ data }) => {
    if (!!data?.error) {
      return Promise.reject(data.error);
    } else {
      return data.access_token;
    }
  });
};

const getUserInfo = async ({ accessToken }: { accessToken: string }) => {
  return axios.get(`https://api.github.com/user?access_token=${accessToken}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  }).then(({ data }) => data);
};

/* ACTUAL PLUGIN */

export default class Authentication {
  constructor (private db: Database, private ep: Entrypoint, private migrations: Migrations) {
    this.migrations.onCollectMigrations.on(() => ({ name: 'users/create', dependencies: [], cb: async () => {
      return this.db.queryOne(`
        CREATE TABLE users (
          id serial PRIMARY KEY,
          email VARCHAR (100) NOT NULL
        );
      `, []);
    }}));

    this.ep.app.post('/auth/github', route(async (req, res, next) => {
      const accessToken = await exchangeCode({ code: req.body.code });
      const userInfo = await getUserInfo({ accessToken });

      let user = await this.db.queryOne(`SELECT * FROM users WHERE email = $1`, [userInfo.email]);

      if (!user) {
        user = await this.db.queryOne(`INSERT INTO users (email) VALUES ($1) RETURNING *`, [userInfo.email]);
      }

      return createJWT({ id: user.id });
    }));

    this.ep.app.get('/auth', route(async (req, res, next) => {
      const { id } = readJWT(req.query.jwt);

      return this.db.queryOne(`SELECT * FROM users WHERE id = $1`, [id]);
    }));
  }
};
