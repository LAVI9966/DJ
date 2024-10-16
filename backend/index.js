import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors())

const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: 'lavishgehlod@gmail.com',
        pass: 'ntvjgguhsntpzspt'
    }
})

const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: 'lavishgehlod@gmail.com',
        to,
        subject, text, html,
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent : " + info.response);
    } catch (error) {
        console.log("eror", error)
    }
}

app.post('/send_email', async (req, res) => {
    const { to, subject, text, html } = req.body;
    console.log("pop")
    await sendEmail(to, subject, text, html)
        .then(() => res.status(200).send("Email send successfullt!"))
        .catch((error) => res.status(500).send(error.message))
})
app.listen(3000, () => {
    console.log("server is listening to port ", 3000)
})