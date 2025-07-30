// C:\qrdobem\api\src\testeImport.js
try {
    const pessoaRoutes = require('./routes/pessoaRoutes'); // Caminho relativo de src/ para routes/
    console.log('pessoaRoutes importado com sucesso:', pessoaRoutes);
} catch (error) {
    console.error('ERRO AO IMPORTAR PESSOA ROUTES:', error.message);
    console.error('Stack trace:', error.stack);
}

try {
    const authRoutes = require('./routes/authRoutes'); // Caminho relativo de src/ para routes/
    console.log('authRoutes importado com sucesso:', authRoutes);
} catch (error) {
    console.error('ERRO AO IMPORTAR AUTH ROUTES:', error.message);
    console.error('Stack trace:', error.stack);
}

console.log('Verificação de importação concluída.');