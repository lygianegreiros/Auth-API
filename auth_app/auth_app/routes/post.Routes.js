
const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();
const { authenticateToken } = require('./userRoutes'); 


router.post('/', authenticateToken, async (req, res) => {
    const { title, content } = req.body;
    
    if (!title || !content) {
        return res.status(400).send('Título e conteúdo são obrigatórios.');
    }

    try {
        const post = new Post({ title, content, author: req.user.id });
        await post.save();

        
        await User.findByIdAndUpdate(req.user.id, { $push: { posts: post._id } });
        
        res.status(201).json(post);
    } catch (error) {
        res.status(500).send('Erro ao criar post');
    }
});


router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username'); 
        res.json(posts);
    } catch (error) {
        res.status(500).send('Erro ao buscar posts');
    }
});


router.put('/:id', authenticateToken, async (req, res) => {
    const { title, content } = req.body;

    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id,
            { title, content },
            { new: true }
        );

        if (!updatedPost) return res.status(404).send('Post não encontrado');

        res.json(updatedPost);
    } catch (error) {
        res.status(500).send('Erro ao atualizar post');
    }
});


router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);

        if (!deletedPost) return res.status(404).send('Post não encontrado');

        
        await User.findByIdAndUpdate(req.user.id, { $pull: { posts: req.params.id } });

        res.send('Post deletado com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao deletar post');
    }
});

module.exports = router;