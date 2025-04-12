const express = require('express');
const router = express.Router();
const Media = require('../models/Media');

// GET - Listar todas as mídias com filtros
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Iniciando busca de mídias...');
    const { belt, category } = req.query;
    const filter = {};
    
    if (belt) {
      console.log(`🔹 Filtro por faixa: ${belt}`);
      filter.belt = belt;
    }
    if (category) {
      console.log(`🔹 Filtro por categoria: ${category}`);
      filter.category = category;
    }

    console.log('🔎 Executando consulta no MongoDB...');
    const media = await Media.find(filter).sort({ date: -1 }).maxTimeMS(10000);
    
    console.log(`✅ Encontradas ${media.length} mídias`);
    res.json(media);
  } catch (err) {
    console.error('❌ Erro na busca de mídias:', err);
    res.status(500).json({ 
      error: 'Erro ao buscar mídias',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// POST - Adicionar nova mídia
router.post('/', async (req, res) => {
  try {
    const { belt, category, description, files, links } = req.body;
    
    // Validação básica
    if (!belt || !category) {
      return res.status(400).json({ error: 'Faixa e categoria são obrigatórias' });
    }

    const newMedia = new Media({
      belt,
      category,
      description,
      files,
      links
    });

    const savedMedia = await newMedia.save();
    res.status(201).json(savedMedia);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT - Atualizar mídia
router.put('/:id', async (req, res) => {
  try {
    const updatedMedia = await Media.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedMedia);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar mídia' });
  }
});

// DELETE - Remover mídia
router.delete('/:id', async (req, res) => {
  try {
    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mídia removida com sucesso' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao remover mídia' });
  }
});

module.exports = router;