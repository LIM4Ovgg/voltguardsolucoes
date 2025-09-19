// server.js - backend em Node.js (Express)
// Uso recomendado: node server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// pasta pública para servir o site staticamente
app.use(express.static(path.join(__dirname, 'public')));

// endpoint para receber contatos do formulário
const DATA_FILE = path.join(__dirname, 'contacts.json');

app.post('/api/contact', (req, res) => {
  const {nome, email, telefone, mensagem, pagina, data} = req.body || {};
  if(!nome || !email || !mensagem){
    return res.status(400).json({error:'Campos obrigatórios ausentes'});
  }
  const entry = {id:Date.now(), nome, email, telefone, mensagem, pagina, data};
  // lê arquivo atual, adiciona e grava
  let arr = [];
  try{
    if(fs.existsSync(DATA_FILE)){
      const raw = fs.readFileSync(DATA_FILE,'utf8');
      arr = JSON.parse(raw || '[]');
    }
  }catch(err){
    console.error('Erro ao ler arquivo:', err);
  }
  arr.push(entry);
  try{
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), 'utf8');
  }catch(err){
    console.error('Erro ao gravar arquivo:', err);
  }
  console.log('Contato recebido:', entry);
  return res.json({ok:true, entryId: entry.id});
});

// rota simples para healthcheck
app.get('/api/health', (req,res)=> res.json({ok:true, ts: new Date().toISOString()}));

// inicia servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
