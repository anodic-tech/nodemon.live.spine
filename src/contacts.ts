import { validate } from 'isemail'
import { pool } from './db'

export const createContact = async (email:string) => {
    if(!validate(email)) throw 'Invalid Email'
    console.log('Creating contact...')
    return pool.query('INSERT INTO contacts (email) VALUES ($1::text);', [email])
}

export const retireveContacts = async () => {
    console.log('Retrieving contacts...')
    return (await pool.query('SELECT * FROM contacts;')).rows.map(c => c.email)
}