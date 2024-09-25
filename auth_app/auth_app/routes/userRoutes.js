const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const secretKey = 'sua_chave_secreta'; 


router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).send('Usuário registrado com sucesso!');
    } catch (error) {
        res.status(400).send('Erro ao registrar usuário');
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Usuário ou senha incorretos');
        }

        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).send('Erro ao fazer login');
    }
});


function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) return res.sendStatus(401); // Não autorizado

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403); // Proibido
        req.user = user;
        next();
    });
}


module.exports = { router, authenticateToken };