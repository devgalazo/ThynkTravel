const mysql = require('mysql2');
const url = require('url');

// Converte a URL do banco de dados para obter as partes necessárias
const dbUrl = process.env.MYSQL_PUBLIC_URL || 'mysql://root:iTGFKGjipZlWLsSiCVHCbemKgPMTiHVb@hopper.proxy.rlwy.net:41174/railway';
const parsedUrl = url.parse(dbUrl);

// Cria a conexão com os dados extraídos da URL
const connection = mysql.createConnection({
    host: parsedUrl.hostname,
    user: parsedUrl.auth.split(':')[0],
    password: parsedUrl.auth.split(':')[1],
    database: parsedUrl.pathname.split('/')[1],
    port: parsedUrl.port,
    connectTimeout: 10000,
});

// Testa a conexão com o banco
connection.connect((err) => {
    if (err) {
        console.error('❌ Erro ao conectar no banco:', err.message);
        process.exit(1); // Encerra o processo caso não consiga conectar
    } else {
        console.log('✅ Conectado ao banco de dados!');
    }
});

module.exports = connection;
