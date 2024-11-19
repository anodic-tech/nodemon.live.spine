import { Pool } from 'pg'

console.log('Connecting to DB...');

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // default Postgres port
  database: process.env.DB_NAME
});

console.log('Connected')