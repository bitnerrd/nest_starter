import { google, gmail_v1 } from "googleapis";
import * as dotenv from "dotenv";

dotenv.config();

const oAuth2Client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

// Set the access token here
oAuth2Client.setCredentials({
  access_token: process.env.GOOGLE_ACCESS_TOKEN,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const sendEmail: any = async ({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) => {
  const raw = `From: "TraderMetrix" <${process.env.TRADER_MATRIX_SUPPORT_MAIL}>\nTo: ${to}\nSubject: ${subject}\nContent-Type: text/html; charset=utf-8\n\n${body}`;
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  const response = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: Buffer.from(raw).toString("base64"),
    },
  });
  return response;
};

export { sendEmail };
