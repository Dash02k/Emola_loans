const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/api/loan", async (req, res) => {
  try {
    const { name, phone, amount, method } = req.body;

    if (!name || !phone || !amount || !method) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios."
      });
    }

    const message =
      "Novo pedido de empréstimo\n\n" +
      "Nome: " + name + "\n" +
      "Telefone: " + phone + "\n" +
      "Valor: " + amount + " MT\n" +
      "Método: " + method;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("Telegram environment variables are missing.");

      return res.status(500).json({
        error: "Servidor não configurado."
      });
    }

    const telegramUrl =
      `https://api.telegram.org/bot${token}/sendMessage`;

    const telegramResponse = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    });

    if (!telegramResponse.ok) {
      console.error(await telegramResponse.text());

      return res.status(500).json({
        error: "Falha ao enviar."
      });
    }

    res.json({
      success: true
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro interno do servidor."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
