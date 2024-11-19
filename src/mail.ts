export const authorize = async (scope:string) => {
  console.log('Retrieving Zoho access token...')
  const response = await fetch('https://accounts.zoho.com/oauth/v2/token?' + new URLSearchParams({
    client_id: process.env.CLIENT_ID as string,
    client_secret: process.env.CLIENT_SECRET as string,
    grant_type: 'client_credentials',
    scope
  }).toString(), {
    method: 'POST'
  })
  return (await response.json()).access_token
}

export const sendMail = async (accessToken: string, contacts: string[]) => {
  const response = await fetch(`https://mail.zoho.com/api/accounts/${process.env.ACCOUNT_ID}/messages`, {
    method: 'POST',
    headers: { 
      'Authorization': `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
      'Accepts': 'application/json'
    },
    body: JSON.stringify({
      "fromAddress": "nodemon@anodic.tech",
      "bccAddress": contacts.join(','),
      "subject": "livestream",
      "content": "Test auto email",
      "askReceipt": "no"
    })
  })
  return response.json()
}