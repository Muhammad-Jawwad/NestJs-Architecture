import { HttpException, HttpStatus } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { vacuaEmail, vacuaPassword } from '../Template/emailConstants';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: vacuaEmail,
    pass: vacuaPassword,
  },
});

export const sendEmail = async (
  toEmail: string,
  subject: string,
  body: string,
) => {
  await transporter.sendMail(
    {
      from: vacuaEmail,
      to: toEmail,
      subject: subject,
      text: subject,
      html: body,
    },
    async (error, info) => {
      if (error) {
        console.log(error);
      } else {
        return info;
      }
    },
  );
};
