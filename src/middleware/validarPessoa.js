// api/src/middleware/validarPessoa.js

const { validarCPF } = require('../utils/cpfValidator');

const validarPessoa = (req, res, next) => {
    const { nomeCompleto, email, senha, telefoneCelular, dataNascimento, cpf } = req.body;

    // Validação de nomeCompleto
    if (!nomeCompleto || nomeCompleto.length < 3) {
        return res.status(400).json({ message: 'Nome completo é obrigatório e deve ter pelo menos 3 caracteres.' });
    }

    // Validação de e-mail (formato básico)
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'E-mail inválido.' });
    }

    // Validação de senha (mínimo 6 caracteres, com números e letras)
    if (!senha || senha.length < 6 || !/[a-zA-Z]/.test(senha) || !/[0-9]/.test(senha)) {
        return res.status(400).json({ message: 'Senha inválida. Deve ter pelo menos 6 caracteres, incluindo letras e números.' });
    }

    // Validação de telefone (ajustado para aceitar + no início)
    if (!telefoneCelular || !/^\+?\d{10,15}$/.test(telefoneCelular)) {
        return res.status(400).json({ message: 'Telefone celular inválido. Use formato como +5551987654321 ou 51987654321.' });
    }

    // Validação de CPF (se fornecido)
    if (cpf) {
        if (!validarCPF(cpf)) {
            return res.status(400).json({ message: 'CPF inválido ou com formato incorreto.' });
        }
    }

    next();
};

module.exports = validarPessoa;