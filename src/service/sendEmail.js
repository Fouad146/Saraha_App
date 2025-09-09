import nodemailer from "nodemailer";

export const sendEmail = async ({from, to, subject, text, html, attachments}={}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, 
    auth: {
      user: "fuadmustafa146@gmail.com",
      pass: "ijosnaezejbdoxuy",
    },
  });
  const info = await transporter.sendMail({
    from: from || '"Fouad" <fuadmustafa146@gmail.com>',
    to: to || "f24mustafafuadmustafa@gmail.com",
    subject: subject || "Hello ya3aaaam ✔",
    text: text || "Hello world? text", // plain‑text body
    html: html || "<b>Hello world? html</b>", // HTML body
    attachments: attachments || [],
});
console.log(info);
console.log(html);
console.log(to);
  
  if (info.accepted.length > 0) {
    return true;
  }
  return false;
};
