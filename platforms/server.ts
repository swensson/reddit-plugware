import { config } from 'dotenv';

config();

import Entrypoint from '/plugins/entrypoint/server';
import Database from '/plugins/database/server';
import Migrations from '/plugins/migrations/server';
import Authentication from '/plugins/authentication/server';

const entrypoint = new Entrypoint();
const database = new Database();

const migrations = new Migrations(database);
// const authentication = new Authentication(database, entrypoint, migrations);
