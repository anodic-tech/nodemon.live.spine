// src/index.ts
import express, { Express, NextFunction, Request, Response } from "express"
import dotenv from "dotenv"
import bodyParser from 'body-parser'
import cors from 'cors'
import { authorize, sendMail } from "./mail";
import { createContact, retireveContacts } from './contacts'
import { startDb } from "./db"

dotenv.config();

const app: Express = express()
const port = process.env.PORT || 3000

const pool = startDb()

app.use(bodyParser.json())

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  optionsSuccessStatus: 200
}))

app.get("/", async (req: Request, res: Response, next) => {
  res.send("Healthy")
})

app.post("/mail", async (req: Request, res: Response, next) => { 
  try{
    console.log('\x1b[33m%s\x1b[0m','[POST /mail] Send Notifications')
    const contacts = await retireveContacts(pool)
    const mailToken = await authorize('ZohoMail.messages.CREATE')
    await sendMail(mailToken, contacts)
    console.log('Sent notifications to: ' + contacts.join(', '))
    res.send('Success')
  } catch(e) {
    next(e)
  }
})

app.post("/contact", async (req: Request, res: Response, next) => {
  try {
    console.log('\x1b[33m%s\x1b[0m','[POST /contact] Create Contact ' + req.body.email)
    await createContact(pool, req.body.email)
    console.log('Created contact ' + req.body.email)
    res.send('Subscribed')
  } catch(e:Error|any) {
    if(e?.message === 'duplicate key value violates unique constraint "contacts_pkey"'){
      res.status(200).send('Subscribed')
    }
    console.log(e)
    next(e)
  }
})

app.use((err: Error, _req: Request, res: Response, next:NextFunction) => {
  console.error(err.message)
  res.status(500).send('Error')
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})