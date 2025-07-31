// api/src/utils/cpfValidator.js

const validarCPF = (cpf) => {
    if (!cpf) {
        return false;
    }

    // Remove caracteres não numéricos
    const cleanedCpf = cpf.replace(/[^\d]/g, '');

    // Verifica se tem 11 dígitos
    if (cleanedCpf.length !== 11) {
        return false;
    }

    // Verifica se todos os dígitos são iguais (ex: "111.111.111-11") - inválido para CPF
    if (/^(\d)\1{10}$/.test(cleanedCpf)) {
        return false;
    }

    let sum = 0;
    let remainder;

    // Validação do primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cleanedCpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11)) {
        remainder = 0;
    }
    if (remainder !== parseInt(cleanedCpf.substring(9, 10))) {
        return false;
    }

    sum = 0;
    // Validação do segundo dígito verificador
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cleanedCpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11)) {
        remainder = 0;
    }
    if (remainder !== parseInt(cleanedCpf.substring(10, 11))) {
        return false;
    }

    return true; // CPF válido
};

module.exports = {
    validarCPF
};