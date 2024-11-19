import { validate } from 'isemail'
import { Pool } from 'pg'

export const createContact = async (pool:Pool, email:string) => {
    if(!validate(email)) throw 'Invalid Email'
    console.log('Creating contact...')
    return pool.query('INSERT INTO contacts (email) VALUES ($1::text);', [email])
}

export const retireveContacts = async (pool:Pool) => {
    console.log('Retrieving contacts...')
    return (await pool.query('SELECT * FROM contacts;')).rows.map(c => c.email)
}