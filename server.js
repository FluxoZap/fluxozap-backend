import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const PIX_KEY = "silvaereisrepresentacao@gmail.com";

let pagamentos = {};

app.post("/criar-pix", (req, res) => {
  const { plano } = req.body;
  const valor = plano === "empresa" ? 49.90 : 19.90;
  const txid = Date.now().toString();

  const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PIX:${PIX_KEY}|VALOR:${valor}`;

  pagamentos[txid] = { status: "PENDENTE", plano };

  setTimeout(() => {
    pagamentos[txid].status = "CONCLUIDA";
  }, 10000);

  res.json({ qrCode, txid });
});

app.get("/status/:txid", (req, res) => {
  const pagamento = pagamentos[req.params.txid];
  if (!pagamento) return res.json({ status: "NAO_ENCONTRADO" });
  res.json({ status: pagamento.status });
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
