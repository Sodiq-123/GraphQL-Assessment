import { config } from '../config/envConfig';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';

export interface ISendMail {
  subject: string;
  body: string
  to: string
}

export const sendEmail = async (email: string, message: string, subject: string) => {
  const mailgun = new Mailgun(FormData);
  const DOMAIN = config.MAILGUN_SUBDOMAIN;
  const client = mailgun.client({ username: 'Sodiq', key: config.MAILGUN_API_KEY })
  
  const data = {
    from: config.EMAIL,
    to: email,
    subject,
    text: message
  }

  client.messages.create(DOMAIN, data).then(() => {
    console.log('Email sent')
  }).catch(error => {
    console.log(error)
  })
}
