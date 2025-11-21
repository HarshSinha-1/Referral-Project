import { Pool } from 'pg';
import config from '../configs/config';

console.log("Database Connection String:", process.env.Db_connection);

const pool = new Pool({
  connectionString: process.env.Db_connection,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then((client) => {
    console.log('Connected to Postgres SQL');
    client.release();
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

export default pool;
