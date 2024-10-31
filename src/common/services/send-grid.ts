import client from '@sendgrid/mail';
export const companyEmail = 'email@sudduth-mail.com';

export const SendEmail = async ({
  to,
  subject,
  body,
  from = { email: companyEmail, name: 'Sudduth Realty' },
}: {
  to: string;
  subject: string;
  body: string;
  from: any;
}) => {
  client.setApiKey(process.env.SENDGRID_API_KEY);

  const message: any = {
    to: to,
    subject: subject,
    body: body,
    from: from,
  };

  try {
    const response = await client.send(message);
    return response;
  } catch (error) {
    return error;
  }
};
