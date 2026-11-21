import { z } from 'zod'
import nodemailer from 'nodemailer'

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(2000),
  website: z.string().max(0).optional(), // honeypot: bots fill this in
})

export default defineEventHandler(async (event) => {
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Please check your name, email and message.' })
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    console.warn('[contact] SMTP not configured; message logged only:', parsed.data)
    return { ok: true }
  }

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 465),
    secure: Number(SMTP_PORT ?? 465) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
  const { name, email, message } = parsed.data
  await transport.sendMail({
    from: SMTP_USER,
    to: CONTACT_TO,
    replyTo: email,
    subject: `Fundere contact: ${name}`,
    text: `${name} <${email}>\n\n${message}`,
  })
  return { ok: true }
})
