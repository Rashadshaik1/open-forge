import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Generic email sender
export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('[Mail Warning]: EMAIL_USER or EMAIL_PASS not set. Skipping email dispatch.');
      return;
    }

    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Open Forge" <noreply@openforge.club>',
      to,
      subject,
      html,
      attachments,
    });

    console.log(`[Email Sent]: ${info.messageId} to ${to}`);
    return info;
  } catch (error) {
    console.error(`[Email Error]: Failed to send to ${to} - ${error.message}`);
  }
};

// 1. Ticket Confirmation Template
export const sendTicketEmail = async ({ user, event, ticketCode, qrCodeDataUrl }) => {
  const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; text-align: center; color: #ffffff;">
        <h2 style="margin: 0;">Open Forge</h2>
        <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 14px;">Event Registration Confirmed</p>
      </div>

      <div style="padding: 20px 0;">
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>You have successfully registered for <strong>${event.title}</strong>.</p>

        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px 0; color: #64748b;"><strong>Venue:</strong></td>
            <td style="padding: 8px 0; color: #0f172a;">${event.venue}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;"><strong>Date & Time:</strong></td>
            <td style="padding: 8px 0; color: #0f172a;">${new Date(event.eventDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;"><strong>Ticket Code:</strong></td>
            <td style="padding: 8px 0; color: #0284c7; font-family: monospace; font-size: 16px;">${ticketCode}</td>
          </tr>
        </table>

        <div style="text-align: center; margin: 24px 0;">
          <p style="font-size: 13px; color: #64748b; margin-bottom: 8px;">Present this QR code at the door for entry:</p>
          <img src="cid:ticket_qr" alt="Ticket QR Code" style="width: 200px; height: 200px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px;" />
        </div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; text-align: center; color: #94a3b8; font-size: 12px;">
        Open Forge • Department of Information Technology • GVPCE (A)
      </div>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: `Your Pass for ${event.title} - Open Forge`,
    html,
    attachments: [
      {
        filename: 'ticket-qr.png',
        content: base64Data,
        encoding: 'base64',
        cid: 'ticket_qr',
      },
    ],
  });
};

// 2. Event Update / Postponement Broadcast
export const sendEventUpdateEmail = async ({ user, event, changeSummary }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #fecaca; border-radius: 12px; background-color: #ffffff;">
      <div style="background-color: #991b1b; padding: 16px; border-radius: 8px; text-align: center; color: #ffffff;">
        <h2 style="margin: 0;">Open Forge Alert</h2>
        <p style="margin: 4px 0 0 0; color: #fecaca; font-size: 14px;">Important Schedule Update</p>
      </div>

      <div style="padding: 20px 0;">
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>There has been an update regarding <strong>${event.title}</strong>.</p>

        <div style="background-color: #fff1f2; border-left: 4px solid #e11d48; padding: 12px; margin: 16px 0; border-radius: 4px;">
          <p style="margin: 0; color: #881337; font-weight: bold;">Update Details:</p>
          <p style="margin: 4px 0 0 0; color: #4c0519;">${changeSummary}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Current Venue:</strong></td>
            <td style="padding: 6px 0; color: #0f172a;">${event.venue}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Current Date:</strong></td>
            <td style="padding: 6px 0; color: #0f172a;">${new Date(event.eventDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
          </tr>
        </table>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; text-align: center; color: #94a3b8; font-size: 12px;">
        Open Forge • Department of Information Technology • GVPCE (A)
      </div>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: `[Update] ${event.title} - Open Forge Schedule Notice`,
    html,
  });
};