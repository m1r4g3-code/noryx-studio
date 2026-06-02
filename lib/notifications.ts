import { format } from 'date-fns'
import { formatTime, toNigerianIntl } from '@/lib/utils'
import type { Appointment } from '@/types'

type AppointmentWithService = Appointment & { service_name: string }

// ─── Email via Gmail SMTP (nodemailer) ───────────────────────────────────────
// Uses a Gmail account + App Password. Sends to ANY recipient (unlike Resend's
// unverified sandbox), ~500 emails/day — plenty for a barbershop.

async function sendEmail(opts: {
  to: string
  subject: string
  html: string
}): Promise<void> {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) return

  const from = process.env.EMAIL_FROM || `Noryx Studio <${user}>`

  try {
    const nodemailer = (await import('nodemailer')).default
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    })
    await transporter.sendMail({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    })
  } catch (err) {
    console.error('[Notifications] Email send failed:', err)
  }
}

// ─── SMS via Twilio ──────────────────────────────────────────────────────────

async function sendSMS(opts: { to: string; body: string }): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_FROM_NUMBER
  if (!sid || !token || !from) return

  try {
    const twilio = (await import('twilio')).default
    const client = twilio(sid, token)
    await client.messages.create({ body: opts.body, from, to: opts.to })
  } catch (err) {
    console.error('[Notifications] SMS send failed:', err)
  }
}

// ─── Barber notification (new booking) ──────────────────────────────────────

export async function sendBarberNewBookingNotification(
  appointment: AppointmentWithService,
  barberEmail?: string | null,
  barberPhone?: string | null
): Promise<void> {
  const dateStr = format(new Date(appointment.appointment_date), 'EEEE, MMMM d, yyyy')
  const timeStr = formatTime(appointment.appointment_time)

  if (barberEmail) {
    await sendEmail({
      to: barberEmail,
      subject: `New Booking — ${appointment.client_name} — ${appointment.service_name} — ${dateStr}`,
      html: barberNewBookingEmail(appointment, dateStr, timeStr),
    })
  }

  if (barberPhone) {
    const sms =
      `[NORYX] New booking: ${appointment.client_name} for ${appointment.service_name} on ${dateStr} at ${timeStr}. ` +
      `Phone: ${appointment.client_phone}. Ref: ${appointment.reference}`
    await sendSMS({ to: toNigerianIntl(barberPhone), body: sms })
  }
}

// ─── Client notification (appointment confirmed) ─────────────────────────────

export async function sendClientConfirmationNotification(
  appointment: AppointmentWithService
): Promise<void> {
  const dateStr = format(new Date(appointment.appointment_date), 'EEEE, MMMM d, yyyy')
  const timeStr = formatTime(appointment.appointment_time)

  if (appointment.client_email) {
    await sendEmail({
      to: appointment.client_email,
      subject: `Your Noryx Studio Appointment is Confirmed ✓`,
      html: clientConfirmationEmail(appointment, dateStr, timeStr),
    })
  }

  // Always send SMS — phone is required
  const sms =
    `[NORYX STUDIO] Your appointment is confirmed! ${appointment.service_name} on ${dateStr} at ${timeStr}. ` +
    `Ref: ${appointment.reference}. Questions? wa.me/2349162035059`
  await sendSMS({ to: toNigerianIntl(appointment.client_phone), body: sms })
}

// ─── Email HTML templates ─────────────────────────────────────────────────────

function barberNewBookingEmail(
  a: AppointmentWithService,
  dateStr: string,
  timeStr: string
): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Booking</title></head>
<body style="background:#0A0A0A;color:#F5F5F5;font-family:Arial,sans-serif;padding:32px;">
  <div style="max-width:540px;margin:0 auto;background:#111111;border:1px solid #2A2A2A;border-top:3px solid #C9A84C;padding:32px;">
    <h1 style="font-size:28px;letter-spacing:4px;color:#C9A84C;margin:0 0 8px;">NORYX STUDIO</h1>
    <p style="color:#888;font-size:12px;letter-spacing:2px;margin:0 0 32px;">NEW BOOKING RECEIVED</p>

    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:10px 0;border-bottom:1px solid #2A2A2A;color:#888;font-size:12px;letter-spacing:1px;">REFERENCE</td>
          <td style="padding:10px 0;border-bottom:1px solid #2A2A2A;color:#C9A84C;font-weight:bold;">${a.reference}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #2A2A2A;color:#888;font-size:12px;letter-spacing:1px;">CLIENT</td>
          <td style="padding:10px 0;border-bottom:1px solid #2A2A2A;">${a.client_name}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #2A2A2A;color:#888;font-size:12px;letter-spacing:1px;">PHONE</td>
          <td style="padding:10px 0;border-bottom:1px solid #2A2A2A;">${a.client_phone}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #2A2A2A;color:#888;font-size:12px;letter-spacing:1px;">SERVICE</td>
          <td style="padding:10px 0;border-bottom:1px solid #2A2A2A;">${a.service_name}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #2A2A2A;color:#888;font-size:12px;letter-spacing:1px;">DATE</td>
          <td style="padding:10px 0;border-bottom:1px solid #2A2A2A;">${dateStr}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #2A2A2A;color:#888;font-size:12px;letter-spacing:1px;">TIME</td>
          <td style="padding:10px 0;border-bottom:1px solid #2A2A2A;">${timeStr}</td></tr>
      ${a.notes ? `<tr><td style="padding:10px 0;color:#888;font-size:12px;letter-spacing:1px;">NOTES</td>
          <td style="padding:10px 0;">${a.notes}</td></tr>` : ''}
    </table>

    <p style="margin-top:32px;color:#888;font-size:12px;">Log in to your dashboard to confirm or manage this appointment.</p>
    <p style="color:#444;font-size:11px;margin-top:24px;">NORYX STUDIO — Precision. Style. Identity.</p>
  </div>
</body>
</html>`
}

function clientConfirmationEmail(
  a: AppointmentWithService,
  dateStr: string,
  timeStr: string
): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Appointment Confirmed</title></head>
<body style="background:#0A0A0A;color:#F5F5F5;font-family:Arial,sans-serif;padding:32px;">
  <div style="max-width:540px;margin:0 auto;background:#111111;border:1px solid #2A2A2A;border-top:3px solid #C9A84C;padding:32px;">
    <h1 style="font-size:28px;letter-spacing:4px;color:#C9A84C;margin:0 0 8px;">NORYX STUDIO</h1>
    <p style="color:#888;font-size:12px;letter-spacing:2px;margin:0 0 8px;">APPOINTMENT CONFIRMED</p>
    <p style="font-size:32px;font-weight:bold;color:#F5F5F5;margin:0 0 32px;">See you soon, ${a.client_name.split(' ')[0]}!</p>

    <div style="background:#1A1A1A;border:1px solid #2A2A2A;padding:20px;margin-bottom:24px;">
      <p style="color:#888;font-size:11px;letter-spacing:2px;margin:0 0 4px;">BOOKING REFERENCE</p>
      <p style="color:#C9A84C;font-size:22px;font-weight:bold;margin:0;">${a.reference}</p>
    </div>

    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:10px 0;border-bottom:1px solid #2A2A2A;color:#888;font-size:12px;letter-spacing:1px;">SERVICE</td>
          <td style="padding:10px 0;border-bottom:1px solid #2A2A2A;">${a.service_name}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #2A2A2A;color:#888;font-size:12px;letter-spacing:1px;">DATE</td>
          <td style="padding:10px 0;border-bottom:1px solid #2A2A2A;">${dateStr}</td></tr>
      <tr><td style="padding:10px 0;color:#888;font-size:12px;letter-spacing:1px;">TIME</td>
          <td style="padding:10px 0;">${timeStr}</td></tr>
    </table>

    <div style="margin-top:32px;padding:16px;border:1px solid #2A2A2A;background:#1A1A1A;">
      <p style="color:#888;font-size:12px;margin:0 0 8px;">NEED TO RESCHEDULE OR HAVE QUESTIONS?</p>
      <a href="https://wa.me/2349162035059" style="color:#C9A84C;font-size:14px;text-decoration:none;">WhatsApp us → wa.me/2349162035059</a>
    </div>

    <p style="color:#444;font-size:11px;margin-top:24px;">NORYX STUDIO — Precision. Style. Identity.</p>
  </div>
</body>
</html>`
}
