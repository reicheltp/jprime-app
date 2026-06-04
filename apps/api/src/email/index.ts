import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

function buildTransport(): Transporter | null {
  const host = process.env.SMTP_HOST
  if (!host) return null

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? '1025'),
    secure: process.env.SMTP_SECURE === 'true',
    ...(process.env.SMTP_USER
      ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? '' } }
      : {}),
  })
}

const transport = buildTransport()

export async function sendOtpEmail(to: string, code: string): Promise<void> {
  if (!transport) {
    console.log(`[email] OTP for ${to}: ${code}`)
    return
  }
  await transport.sendMail({
    from: process.env.SMTP_FROM ?? 'noreply@jprime.io',
    to,
    subject: `Your JPrime sign-in code: ${code}`,
    text: `Your JPrime sign-in code is: ${code}\n\nExpires in 10 minutes.`,
    html: `
      <div style="font-family:sans-serif;max-width:420px;margin:0 auto;background:#212529;color:#fff;padding:32px;border-radius:8px">
        <h2 style="margin:0 0 8px;color:#39CBFB">JPrime Conference</h2>
        <p style="color:rgba(255,255,255,0.7)">Your sign-in code:</p>
        <div style="font-size:40px;font-weight:bold;letter-spacing:10px;color:#ffffff;padding:16px;background:rgba(255,255,255,0.08);border-radius:8px;text-align:center">${code}</div>
        <p style="color:rgba(255,255,255,0.4);font-size:13px;margin-top:16px">Expires in 10 minutes. If you didn't request this, ignore it.</p>
      </div>`,
  })
}
