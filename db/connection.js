const mysql = require('mysql2');

//Conexão com o banco de dados
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'thynktravel'
});


//Testa conexão com o banco
connection.connect(err => {
    if (err) {
        console.error('❌ Erro ao conectar no banco:', err.message);
        process.exit(1);
        return;
    }
    console.log('✅ Conectado ao banco de dados!');
});

module.exports = connection;
