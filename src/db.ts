import { Pool } from 'pg'

export const startDb = () => {
  console.log('Connecting to DB...')
  const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT), // default Postgres port
    database: process.env.DB_NAME
  })
  console.log('Connected')
  return pool
}