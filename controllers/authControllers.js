const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../db/connection');
const axios = require("axios");
require("dotenv").config();


// Cadastro novo usuário
exports.cadastrar = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    connection.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro interno do servidor.' });

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email já cadastrado.' });
        }

        bcrypt.hash(senha, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ message: 'Erro ao criptografar a senha.' });

            connection.query(
                'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
                [nome, email, hashedPassword],
                (err) => {
                    if (err) return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });

                    res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
                }
            );
        });
    });
};

// Login do usuário
exports.login = (req, res) => {
    const { emailc, senhac } = req.body;

    if (!emailc || !senhac) {
        return res.status(400).json({ error: 'Campos obrigatórios.' });
    }

    connection.query("SELECT * FROM usuarios WHERE email = ?", [emailc], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro no servidor.' });

        if (results.length === 0) {
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }

        const usuario = results[0];

        const senhaCorreta = await bcrypt.compare(senhac, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({ message: 'Login bem-sucedido!', token });
    });
};

exports.loginComGoogle = (req, res) => {
    const { nome, email, provider, provider_id } = req.body;

    if (!email || !provider || !provider_id) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }

    connection.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao acessar banco de dados.' });

        if (results.length > 0) {
            const usuario = results[0];

            connection.query(
                "SELECT * FROM logins_sociais WHERE usuario_id = ? AND provider = ?",
                [usuario.id, provider],
                (err, social) => {
                    if (err) return res.status(500).json({ error: 'Erro ao verificar login social.' });

                    if (social.length === 0) {
                        connection.query(
                            "INSERT INTO logins_sociais (usuario_id, provider, provider_id) VALUES (?, ?, ?)",
                            [usuario.id, provider, provider_id],
                            (err) => {
                                if (err) return res.status(500).json({ error: 'Erro ao vincular login social.' });
                            }
                        );
                    }

                    const token = jwt.sign(
                        { id: usuario.id, nome: usuario.nome, email: usuario.email },
                        process.env.JWT_SECRET,
                        { expiresIn: '2h' }
                    );

                    return res.json({ success: true, token });
                }
            );
        } else {
            connection.query(
                "INSERT INTO usuarios (nome, email) VALUES (?, ?)",
                [nome, email],
                (err, result) => {
                    if (err) return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });

                    const usuario_id = result.insertId;

                    connection.query(
                        "INSERT INTO logins_sociais (usuario_id, provider, provider_id) VALUES (?, ?, ?)",
                        [usuario_id, provider, provider_id],
                        (err) => {
                            if (err) return res.status(500).json({ error: 'Erro ao vincular login social.' });

                            const token = jwt.sign(
                                { id: usuario_id, nome, email },
                                process.env.JWT_SECRET,
                                { expiresIn: '2h' }
                            );

                            return res.status(201).json({ success: true, token });    }
                    );
                }
            );
        }
    });
};


let amadeusToken = null;
let tokenExpira = null;

async function getAmadeusToken() {
  const agora = Date.now();
  if (amadeusToken && tokenExpira && agora < tokenExpira) return amadeusToken;

  const response = await axios.post(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_CLIENT_ID,
      client_secret: process.env.AMADEUS_CLIENT_SECRET,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  amadeusToken = response.data.access_token;
  tokenExpira = agora + response.data.expires_in * 1000 - 60000;
  return amadeusToken;
}

exports.buscarVoos = async (req, res) => {
  try {
    const { origem, destino, departureDate, returnDate, adultos } = req.query;
    const token = await getAmadeusToken();

    const response = await axios.get("https://test.api.amadeus.com/v2/shopping/flight-offers", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        originLocationCode: origem,
        destinationLocationCode: destino,
        departureDate: departureDate,
        ...(returnDate && { returnDate }),
        adults: adultos || 1,
        currencyCode: "BRL",
        max: 25,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("Erro ao buscar voos:", err.response?.data || err.message);
    res.status(500).json({ erro: "Erro ao buscar voos." });
  }
};
