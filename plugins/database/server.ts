import { Pool } from 'pg';

export default class Database {
  public pool: Pool;

  constructor () {
    this.pool = new Pool({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: Number(process.env.POSTGRES_PORT),
    });

    this.pool.on('error', (err) => {
      // logger.error('Unexpected error on idle client', err);
    });
  }

  public query = async <T = any>(query: string, values?: any[]): Promise<T[]> => {
    // logger.info('database query', { query, values });
    return this.pool.query(query, values).then(({ rows }) => rows);
  };

  public queryOne = async <T = any>(query: string, values?: any[]): Promise<T | null> => {
    // logger.info('database query', { query, values });
    return this.pool.query(query, values).then(({ rows }) => rows.length > 0 ? rows[0] : null);
  };
};
