function validarNome(nome) {
  const partes = nome.trim().split(/\s+/);
  if (partes.length < 2) return false;
  return partes.every(p => p.length >= 2);
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarTelefone(telefone) {
  return /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/.test(telefone);
}

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;
  return true;
}

document.getElementById('clienteForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;
  const nome = form.nome.value;
  const email = form.email.value;
  const telefone = form.telefone.value;
  const cpf = form.cpf.value;

  if (!validarNome(nome)) {
    document.getElementById('resultado').innerText = 'Digite nome e sobrenome, cada um com pelo menos 2 letras.';
    return;
  }
  if (!validarEmail(email)) {
    document.getElementById('resultado').innerText = 'Email inválido!';
    return;
  }
  if (!validarTelefone(telefone)) {
    document.getElementById('resultado').innerText = 'Telefone inválido!';
    return;
  }
  if (!validarCPF(cpf)) {
    document.getElementById('resultado').innerText = 'CPF inválido!';
    return;
  }

  const dados = { nome, email, telefone, cpf };
  try {
    const resposta = await fetch('/api/v1/pessoas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    const resultado = await resposta.json();
    if (resposta.ok) {
      document.getElementById('resultado').innerText = 'Cadastro realizado com sucesso!';
      form.reset();
    } else {
      document.getElementById('resultado').innerText = resultado.error || 'Erro ao cadastrar.';
    }
  } catch (err) {
    document.getElementById('resultado').innerText = 'Erro de conexão.';
  }
});