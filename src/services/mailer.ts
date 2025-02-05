import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  connectionTimeout: 10000,
});

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../templates/verify.hbs"
    );
    const source = fs.readFileSync(templatePath, "utf-8");
    const template = handlebars.compile(source);

    const html = template({
      link: `${process.env.BASE_URL_FE}/verification/${token}`,
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Verify Youre Email Address",
      html,
      attachments: [
        {
          filename: "/LIT.png",
          path: path.join(__dirname, "../../public/LIT.png"),
          cid: "logo",
        },
      ],
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

transporter.verify((error) => {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

export const sendResetPassEmail = async (email: string, token: string) => {
  try {
    const templatePath = path.join(__dirname, "../templates", "resetpass.hbs");
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const compiledTemplate = handlebars.compile(templateSource);
    const html = compiledTemplate({
      link: `${process.env.BASE_URL_FRONTEND}/resetpassword/${token}`,
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Reset your password",
      html,
    });
  } catch (error) {
    throw error;
  }
};

export const sendReverificationEmail = async (email: string, token: string) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../templates",
      "reverification.hbs"
    );
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const compiledTemplate = handlebars.compile(templateSource);
    const html = compiledTemplate({
      link: `${process.env.BASE_URL_FRONTEND}/reverify/${token}`,
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Changing email address",
      html,
    });
  } catch (error) {
    throw error;
  }
};
