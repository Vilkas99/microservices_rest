import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true para 465, false para el resto de puertos
  auth: {
    user: "pruebitapae@gmail.com", // email default con el que se van a enviar los correos
    pass: "znxavcxhvgdmiqkt", // contraseña de ese email
  },
});

transporter.verify().then(() => {
  console.log("Listo para mandar emails :D");
});

export async function email(emailTo: string, subject: string, body: string) {
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
