// Email sending via Resend
// Note: In production these calls should go through a serverless function
// to keep the API key server-side. For Vercel deployment use /api/send-email.js

const RESEND_API_KEY = 're_egHBiKmF_8nUWPbHiojjJuwtTuY3MLwni'
const FROM_EMAIL = 'AG Dealer Connect <noreply@antiquegatherings.com>'
const ADMIN_EMAIL = 'submitadmin@antiquegatherings.com'

async function sendEmail({ to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Email send failed')
  }
  return res.json()
}

export async function sendDealerApprovalEmail(dealer) {
  return sendEmail({
    to: dealer.email,
    subject: 'Your AG Dealer Connect account has been approved',
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:2rem;">
        <img src="https://res.cloudinary.com/dujmo9fbu/image/upload/ag_logo" alt="Antique Gatherings" style="width:160px;margin-bottom:1.5rem;">
        <h2 style="font-size:20px;font-weight:500;margin-bottom:0.5rem;">Welcome to AG Dealer Connect</h2>
        <p style="color:#666;margin-bottom:1rem;">Hi ${dealer.name},</p>
        <p style="color:#666;margin-bottom:1.5rem;">Your dealer account has been approved. You can now log in and browse all seller submissions.</p>
        <a href="https://submit.antiquegatherings.com" style="background:#3C3489;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:14px;">Log in to AG Dealer Connect</a>
        <p style="color:#aaa;font-size:12px;margin-top:2rem;">antiquegatherings.com/submit</p>
      </div>
    `
  })
}

export async function sendDealerRejectionEmail(dealer) {
  return sendEmail({
    to: dealer.email,
    subject: 'Update on your AG Dealer Connect application',
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:2rem;">
        <h2 style="font-size:20px;font-weight:500;margin-bottom:0.5rem;">AG Dealer Connect</h2>
        <p style="color:#666;margin-bottom:1rem;">Hi ${dealer.name},</p>
        <p style="color:#666;margin-bottom:1rem;">Thank you for applying for a dealer account. Unfortunately we are unable to approve your application at this time.</p>
        <p style="color:#666;">If you have questions, please contact us at ${ADMIN_EMAIL}.</p>
        <p style="color:#aaa;font-size:12px;margin-top:2rem;">antiquegatherings.com/submit</p>
      </div>
    `
  })
}

export async function sendNewDealerApplicationEmail(dealer) {
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `New dealer application: ${dealer.name}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:2rem;">
        <h2 style="font-size:20px;font-weight:500;margin-bottom:1rem;">New dealer application</h2>
        <table style="width:100%;font-size:14px;border-collapse:collapse;">
          <tr><td style="color:#888;padding:6px 0;">Name</td><td>${dealer.name}</td></tr>
          <tr><td style="color:#888;padding:6px 0;">Business</td><td>${dealer.business_name || '—'}</td></tr>
          <tr><td style="color:#888;padding:6px 0;">Email</td><td>${dealer.email}</td></tr>
          <tr><td style="color:#888;padding:6px 0;">Phone</td><td>${dealer.phone || '—'}</td></tr>
          <tr><td style="color:#888;padding:6px 0;">Dealer #</td><td>${dealer.dealer_number || '—'}</td></tr>
          <tr><td style="color:#888;padding:6px 0;">Store</td><td>${dealer.store_location || '—'}</td></tr>
        </table>
        <a href="https://submit.antiquegatherings.com" style="display:inline-block;margin-top:1.5rem;background:#3C3489;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:14px;">Review in Admin Portal</a>
      </div>
    `
  })
}

export async function sendContactSellerEmail({ dealerName, dealerEmail, sellerEmail, subject, message, itemDesc }) {
  return sendEmail({
    to: sellerEmail,
    subject: subject || `A dealer is interested in your item`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:2rem;">
        <h2 style="font-size:20px;font-weight:500;margin-bottom:0.5rem;">AG Dealer Connect</h2>
        <p style="color:#666;margin-bottom:1rem;">A dealer is interested in your submission${itemDesc ? ': <strong>' + itemDesc + '</strong>' : ''}.</p>
        <div style="background:#f9f8f6;border-radius:8px;padding:1rem;margin-bottom:1.5rem;">
          <p style="font-size:14px;color:#1a1a1a;margin:0;">${message}</p>
        </div>
        <p style="color:#888;font-size:13px;">From: ${dealerName} (${dealerEmail})</p>
        <p style="color:#888;font-size:13px;">Reply directly to this email to respond.</p>
        <p style="color:#aaa;font-size:12px;margin-top:2rem;">antiquegatherings.com/submit</p>
      </div>
    `
  })
}

export async function sendNewSubmissionAlert({ sellerName, itemDesc, price }) {
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `New submission from ${sellerName}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:2rem;">
        <h2 style="font-size:20px;font-weight:500;margin-bottom:1rem;">New item submitted</h2>
        <table style="width:100%;font-size:14px;border-collapse:collapse;">
          <tr><td style="color:#888;padding:6px 0;">Seller</td><td>${sellerName}</td></tr>
          <tr><td style="color:#888;padding:6px 0;">Item</td><td>${itemDesc || 'No description'}</td></tr>
          <tr><td style="color:#888;padding:6px 0;">Price</td><td>${price || 'TBD'}</td></tr>
        </table>
        <a href="https://submit.antiquegatherings.com" style="display:inline-block;margin-top:1.5rem;background:#3C3489;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:14px;">View in Admin Portal</a>
      </div>
    `
  })
}
