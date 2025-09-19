// script.js - lógica de formulário com envio para backend e melhorias UX
document.getElementById('year')?.appendChild(document.createTextNode(new Date().getFullYear()));
document.getElementById('year2')?.appendChild(document.createTextNode(new Date().getFullYear()));

// Telefone padrão do WhatsApp (alterar conforme necessário)
const WHATSAPP_NUMBER = '551900000000';
const whatsappBtn = document.getElementById('whatsappBtn');
if(whatsappBtn){
  // atualiza link para manter telefone em um só lugar
  whatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá, gostaria de um orçamento')}`;
}

async function submitForm(e){
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  if(!nome || !email || !mensagem){
    alert('Por favor preencha os campos obrigatórios.');
    return;
  }

  const payload = {nome, email, telefone, mensagem, pagina: location.pathname, data: new Date().toISOString()};

  // tenta enviar para backend local (/api/contact). Se não houver backend, apenas mostra mensagem.
  try{
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if(res.ok){
      alert('Mensagem enviada com sucesso! Responderemos em breve.');
      document.getElementById('contactForm').reset();
    } else {
      const txt = await res.text();
      console.warn('Resposta do servidor:',txt);
      alert('Não foi possível enviar no momento. Sua mensagem foi salva localmente.');
      saveLocal(payload);
      document.getElementById('contactForm').reset();
    }
  }catch(err){
    console.error(err);
    alert('Servidor indisponível — salvando localmente.');
    saveLocal(payload);
    document.getElementById('contactForm').reset();
  }
}

function saveLocal(payload){
  // salva em localStorage como fallback
  const key = 'contatos_offline';
  const arr = JSON.parse(localStorage.getItem(key) || '[]');
  arr.push(payload);
  localStorage.setItem(key, JSON.stringify(arr));
}
