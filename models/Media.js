const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  belt: {
    type: String,
    required: true,
    enum: ['branca', 'amarela', 'laranja', 'azul', 'verde', 'roxa', 'marrom', 'preta']
  },
  category: {
    type: String, 
    required: true,
    enum: ['kata', 'kihon', 'bunkai']
  },
  description: String,
  files: [{
    name: String,
    content: String, // Base64 encoded
    type: String // MIME type
  }],
  links: String,
  date: { 
    type: Date,
    default: Date.now
  },
  uploadedBy: {
    type: String,
    default: 'anonymous'
  }
});

// Adiciona índice para buscas mais rápidas
MediaSchema.index({ belt: 1, category: 1 });

module.exports = mongoose.model('Media', MediaSchema);