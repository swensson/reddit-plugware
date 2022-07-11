import Database from '/plugins/database/server';
import Migrations from '/plugins/migrations/server';
import Entrypoint from '/plugins/entrypoint/server';

import { route } from '/libs/utils';

export default class Authentication {
  constructor (private db: Database, private ep: Entrypoint, private migrations: Migrations) {
    this.migrations.onCollectMigrations.on(() => ({ name: 'users/create', dependencies: [], cb: async () => {
      return this.db.queryOne(`
        CREATE TABLE posts (
          id serial PRIMARY KEY,
          votes_up INT NOT NULL DEFAULT 0,
          votes_down INT NOT NULL DEFAULT 0,
          author VARCHAR (100) NOT NULL,
          message VARCHAR (100) NOT NULL,
          path VARCHAR(200) NOT NULL
        );
      `, []);
    }}));

    this.ep.app.get('/thread', route(async (req, res) => {
      const { path, deep, sort, filter, page, perPage } = req.query;

      let query = `SELECT * FROM posts WHERE path LIKE`

        // const messages = await pool.query(`SELECT * FROM messages WHERE path = $1`, ['/' + path.join('/')]).then(({ rows }) => rows);

      // sort

      // filter

      // page perPage

      return this.db.query(``, []);
    }));

    // this.ep.app.post('/auth/github', route(async (req, res, next) => {
    //   const accessToken = await exchangeCode({ code: req.body.code });
    //   const userInfo = await getUserInfo({ accessToken });
    //
    //   let user = await this.db.queryOne(`SELECT * FROM users WHERE email = $1`, [userInfo.email]);
    //
    //   if (!user) {
    //     user = await this.db.queryOne(`INSERT INTO users (email) VALUES ($1) RETURNING *`, [userInfo.email]);
    //   }
    //
    //   return createJWT({ id: user.id });
    // }));
    //
    // this.ep.app.get('/auth', route(async (req, res, next) => {
    //   const { id } = readJWT(req.query.jwt);
    //
    //   return this.db.queryOne(`SELECT * FROM users WHERE id = $1`, [id]);
    // }));
  }
};
