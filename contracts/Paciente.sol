// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Paciente {
    struct Paciente {
        string nome;
        string cpf;
        uint idade;
        string endereco;
    }

    mapping(string => Paciente) private pacientes;
    string[] private cpfs;

    event PacienteCadastrado(string cpf, string nome);

    function cadastrarPaciente(
        string memory _nome,
        string memory _cpf,
        uint _idade,
        string memory _endereco
    ) public {
        require(bytes(_nome).length > 0, "Nome obrigatorio");
        require(bytes(_cpf).length > 0, "CPF obrigatorio");
        require(_idade > 12, "Idade deve ser maior que 12");
        require(bytes(pacientes[_cpf].cpf).length == 0, "CPF ja cadastrado");

        Paciente memory novoPaciente = Paciente({
            nome: _nome,
            cpf: _cpf,
            idade: _idade,
            endereco: _endereco
        });

        pacientes[_cpf] = novoPaciente;
        cpfs.push(_cpf);

        emit PacienteCadastrado(_cpf, _nome);
    }

    function consultarPaciente(string memory _cpf) public view returns (string memory, uint, string memory) {
        require(bytes(pacientes[_cpf].cpf).length > 0, "Paciente nao encontrado");
        Paciente memory p = pacientes[_cpf];
        return (p.nome, p.idade, p.endereco);
    }

    function listarCPFs() public view returns (string[] memory) {
        return cpfs;
    }
}