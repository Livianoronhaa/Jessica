const checkbox = document.getElementById('presenca');
const extraFields = document.getElementById('extraFields');
const novidadesCheckbox = document.getElementById('novidades');
const assuntoField = document.querySelector('.input-group:nth-child(6)');
const cadastros = [];

// Esconder o campo de assunto inicialmente
assuntoField.style.display = 'none';

// Mensagem de boas-vindas
alert('Olá! Seja bem-vindo(a)!');

// Mostrar/ocultar campos extras (presença)
checkbox.onchange = () => {
  extraFields.style.display = checkbox.checked ? 'block' : 'none';
  if (!checkbox.checked) {
    novidadesCheckbox.checked = false;
    assuntoField.style.display = 'none';
  }
};

// Mostrar/ocultar campo de assunto (novidades)
novidadesCheckbox.onchange = () => {
  assuntoField.style.display = novidadesCheckbox.checked ? 'block' : 'none';
};

// Atualizar data e hora
function atualizaDataHora() {
  const dataHora = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  document.getElementById('dataHora').innerHTML = dataHora.toLocaleDateString(
    'pt-BR',
    options
  );
}

atualizaDataHora();
setInterval(atualizaDataHora, 1000);

// Função para remover cadastro
function removerCadastro(index) {
  if (confirm('Tem certeza que deseja remover este participante?')) {
    cadastros.splice(index, 1);
    listarCadastros(); // Esta chamada vai reconstruir a lista
  }
}

// Listar cadastros
function listarCadastros() {
  const lista = document.getElementById('listaCadastros');
  lista.innerHTML = ''; // Limpa a lista antes de recriar os itens

  cadastros.forEach((cadastro, index) => {
    const div = document.createElement('div');
    div.className = 'cadastro-item';

    // Adiciona classe específica para VIP ou Convidado
    if (cadastro.presenca && cadastro.ingresso === 'VIP') {
      div.classList.add('vip');
    } else if (cadastro.presenca && cadastro.ingresso === 'Convidado') {
      div.classList.add('convidado');
    }

    div.innerHTML = `
      ${
        cadastro.ingresso === 'VIP' || cadastro.ingresso === 'Convidado'
          ? `<h4>${cadastro.ingresso.toUpperCase()}</h4>`
          : ''
      }
      <p><strong>Nome:</strong> ${cadastro.nome}</p>
      <p><strong>E-mail:</strong> ${cadastro.email}</p>
      <p><strong>Presença confirmada:</strong> ${
        cadastro.presenca ? 'Sim' : 'Não'
      }</p>
      ${
        cadastro.presenca
          ? `<p><strong>Tipo de ingresso:</strong> ${cadastro.ingresso}</p>`
          : ''
      }
      ${
        cadastro.presenca
          ? `<p><strong>Receber novidades:</strong> ${
              cadastro.novidades ? 'Sim' : 'Não'
            }</p>`
          : ''
      }
      ${
        cadastro.novidades
          ? `<p><strong>Assunto de interesse:</strong> ${cadastro.assunto}</p>`
          : ''
      }
      <p><strong>Data do cadastro:</strong> ${cadastro.dataCadastro}</p>
      <button class="btn-remover" data-index="${index}">Remover</button>
    `;
    lista.appendChild(div);
  });

  // Adiciona eventos aos botões de remover
  document.querySelectorAll('.btn-remover').forEach((btn) => {
    btn.addEventListener('click', function () {
      const index = parseInt(this.getAttribute('data-index'));
      removerCadastro(index);
    });
  });
}

// Cadastrar novo participante
document.getElementById('btnCadastrar').addEventListener('click', function () {
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const presenca = document.getElementById('presenca').checked;
  const ingresso = presenca ? document.getElementById('ingresso').value : null;
  const novidades = presenca
    ? document.getElementById('novidades').checked
    : false;
  const assunto = novidades ? document.querySelector('#assunto').value : null;
  const dataCadastro = new Date().toLocaleString('pt-BR');

  if (!nome || !email) {
    alert('Por favor, preencha pelo menos nome e e-mail!');
    return;
  }

  const novoCadastro = {
    nome,
    email,
    presenca,
    ingresso,
    novidades,
    assunto,
    dataCadastro,
  };

  cadastros.push(novoCadastro);
  listarCadastros();

  // Limpar formulário
  document.getElementById('nome').value = '';
  document.getElementById('email').value = '';
  document.getElementById('presenca').checked = false;
  if (presenca) {
    document.getElementById('ingresso').value = 'Padrão';
    document.getElementById('novidades').checked = false;
  }
  extraFields.style.display = 'none';
  assuntoField.style.display = 'none';

  alert('Cadastro realizado com sucesso!');
});

// Inicializar lista vazia
listarCadastros();
