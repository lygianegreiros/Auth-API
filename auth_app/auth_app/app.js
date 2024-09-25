const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes').router; 
const postRoutes = require('./routes/postRoutes'); 

const app = express();
app.use(express.json());


mongoose.connect('http://localhost:3000/api', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));


app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});