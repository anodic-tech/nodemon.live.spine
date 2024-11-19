// src/index.ts
import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import bodyParser from 'body-parser'
import { authorize, sendMail } from "./mail";
import { createContact, retireveContacts } from './contacts'

dotenv.config();

const app: Express = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

app.get("/", async (req: Request, res: Response) => {
  res.send("Healthy")
})

app.post("/mail", async (req: Request, res: Response, next) => { 
  try{
    console.log('\x1b[33m%s\x1b[0m','[POST /mail] Send Notifications')
    const contacts = await retireveContacts()
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
    await createContact(req.body.email)
    console.log('Created contact ' + req.body.email)
    res.send('Success')
  } catch(e) {
    next(e)
  }
})

app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack)
  res.status(500).send(err.message)
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})