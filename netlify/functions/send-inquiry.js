"use strict";

const DEFAULT_RECIPIENTS = ["prem@kppackaging.com", "sales@kppackaging.com"];
const FIELD_LABELS = {
  name: "Name",
  company: "Company",
  email: "Email",
  phone: "Phone",
  product: "Product of interest",
  coating: "Coating",
  country: "Country",
  message: "Message",
  "form-name": "Form"
};

const clean = (value) => String(value || "").trim();
const escapeHtml = (value) => clean(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return response(405, { error: "Method not allowed" });
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch (err) {
    return response(400, { error: "Invalid JSON" });
  }

  if (clean(data["bot-field"])) return response(204);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INQUIRY_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("Missing RESEND_API_KEY or INQUIRY_FROM_EMAIL");
    return response(500, { error: "Email is not configured" });
  }

  const recipients = clean(process.env.INQUIRY_TO_EMAILS)
    ? process.env.INQUIRY_TO_EMAILS.split(",").map(clean).filter(Boolean)
    : DEFAULT_RECIPIENTS;
  const formName = clean(data["form-name"]) || "inquiry";
  const senderName = clean(data.name) || "Website visitor";
  const senderEmail = clean(data.email);
  const product = clean(data.product) || "General inquiry";
  const subject = `New ${formName} from ${senderName} - ${product}`;

  const fields = ["form-name", "name", "company", "email", "phone", "product", "coating", "country", "message"];
  const rows = fields.map((key) => {
    const value = clean(data[key]);
    if (!value) return "";
    return `<tr><th align="left" valign="top" style="padding:8px 12px;background:#f4f4f8;border-bottom:1px solid #e4e4ec">${FIELD_LABELS[key] || key}</th><td style="padding:8px 12px;border-bottom:1px solid #e4e4ec">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`;
  }).filter(Boolean).join("");

  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#1b1b2a">
    <h2>New website inquiry</h2>
    <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;min-width:320px">${rows}</table>
    <p style="margin-top:18px;color:#5c5d69">Reply to this email to contact ${escapeHtml(senderName)}${senderEmail ? ` at ${escapeHtml(senderEmail)}` : ""}.</p>
  </body></html>`;

  const text = fields.map((key) => {
    const value = clean(data[key]);
    return value ? `${FIELD_LABELS[key] || key}: ${value}` : "";
  }).filter(Boolean).join("\n");

  const resendPayload = {
    from,
    to: recipients,
    subject,
    html,
    text
  };
  if (senderEmail) resendPayload.reply_to = senderEmail;

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(resendPayload)
  });

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text();
    console.error("Resend email failed", resendResponse.status, errorText);
    return response(502, { error: "Email provider failed" });
  }

  return response(200, { ok: true });
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    },
    body: body ? JSON.stringify(body) : ""
  };
}
