import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // carrega variáveis do .env

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("../"));

// Configuração do transporte de email
const transporter = nodemailer.createTransport({
  service: "gmail", // pode ser 'outlook', 'yahoo' ou SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Rota de contato
app.post("/api/contact", async (req, res) => {
  const { nome, email, mensagem } = req.body;

  try {
    await transporter.sendMail({
      from: `"Site VoltGuard Soluções <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO, // <- email da empresa que receberá
      subject: "Novo contato do site",
      text: `
        Nome: ${nome}
        Email: ${email}
        Mensagem: ${mensagem}
      `
    });

    res.json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    res.status(500).json({ success: false, message: "Erro ao enviar mensagem" });
  }
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
