const response = await fetch('./Paciente.json');
const PacienteJson = await response.json();

const web3 = new Web3('http://127.0.0.1:7545');

const networkId = await web3.eth.net.getId();
const deployedNetwork = PacienteJson.networks[networkId];
if (!deployedNetwork) throw new Error('Contrato não encontrado');

const contrato = new web3.eth.Contract(PacienteJson.abi, deployedNetwork.address);
const contas = await web3.eth.getAccounts();
const contaPrincipal = contas[0];

const menuPrincipal = document.getElementById("menuPrincipal");
const sections = document.querySelectorAll(".card");

document.querySelectorAll(".menu-card").forEach(card => {
  card.addEventListener("click", () => {
    const target = card.getAttribute("data-target");
    sections.forEach(sec => sec.classList.add("hidden"));
    document.getElementById(target).classList.remove("hidden");
  });
});

document.querySelectorAll(".voltarButton").forEach(btn => {
  btn.addEventListener("click", () => {
    sections.forEach(sec => sec.classList.add("hidden"));
    menuPrincipal.classList.remove("hidden");
  });
});

const resultadoCadastro = document.getElementById('resultadoCadastro');
const resultadoConsulta = document.getElementById('resultadoConsulta');
const resultadoLista = document.getElementById('resultadoLista');

const cadastrarButton = document.getElementById('cadastrarButton');
const consultarButton = document.getElementById('consultarButton');
const listarCPFsButton = document.getElementById('listarCPFsButton');

function mostarMensagem(element, msg, type="success") {
  element.textContent = msg;
  element.className = `resultado ${type} show`;
}

cadastrarButton.addEventListener('click', async () => {
  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  const idade = parseInt(document.getElementById('idade').value);
  const endereco = document.getElementById('endereco').value;

  if (!nome || !cpf || !idade || !endereco) return mostarMensagem(resultadoCadastro, "Preencha todos os campos!", "error");
  if (idade <= 12) return mostarMensagem(resultadoCadastro, "Idade deve ser maior que 12 anos!", "error");

  try {
    await contrato.methods
      .cadastrarPaciente(nome, cpf, idade, endereco)
      .send({ from: contaPrincipal, gas: 300000 });

    mostarMensagem(resultadoCadastro, `Paciente ${nome} cadastrado com sucesso!`);
  } catch (erro) {
    console.error(erro);
    mostarMensagem(resultadoCadastro, `Erro ao cadastrar paciente: ${erro.message}`, "error");
  }
});

consultarButton.addEventListener('click', async () => {
  const cpfConsulta = document.getElementById('cpfConsulta').value;
  if (!cpfConsulta) return mostarMensagem(resultadoConsulta, "Digite um CPF para consulta!", "error");

  try {
    const paciente = await contrato.methods.consultarPaciente(cpfConsulta).call();
    mostarMensagem(resultadoConsulta, `Nome: ${paciente[0]}, Idade: ${paciente[1]}, Endereço: ${paciente[2]}`);
  } catch (erro) {
    console.error(erro);
    mostarMensagem(resultadoConsulta, `Paciente não encontrado ou erro: ${erro.message}`, "error");
  }
});

listarCPFsButton.addEventListener('click', async () => {
  try {
    const cpfs = await contrato.methods.listarCPFs().call();
    mostarMensagem(resultadoLista, cpfs.length > 0 ? cpfs.join(', ') : 'Nenhum CPF cadastrado');
  } catch (erro) {
    console.error(erro);
    mostarMensagem(resultadoLista, `Erro ao listar CPFs: ${erro.message}`, "error");
  }
});