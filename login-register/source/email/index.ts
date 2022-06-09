import nodemailer from "nodemailer";
require("dotenv").config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER, // email default con el que se van a enviar los correos
    pass: process.env.EMAIL_PASSWORD, // contraseña de ese email
  },
});

transporter.verify().then(() => {
  console.log("Listo para mandar emails :D");
});

export async function sendEmail(
  emailTo: string,
  subject: string,
  body: string
) {
  try {
    await transporter.sendMail({
      from: "<pruebitapae@gmail.com>", // dirección de correo desde donde será enviado el correo
      to: emailTo, // email, donde será enviado o lista de correos donde serán enviados
      subject: subject, // Asunto del correo
      html: body, // Cuerpo del HTML
    });
  } catch (error) {
    return console.log("El correo no fue enviado");
  }
}
