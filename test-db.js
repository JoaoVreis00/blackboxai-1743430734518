const mongoose = require('mongoose');
const Media = require('./models/Media');

async function testConnection() {
  try {
    // Testar criação
    const newMedia = await Media.create({
      belt: 'branca',
      category: 'kata',
      description: 'Teste de conexão com MongoDB em memória'
    });
    console.log('✅ Mídia criada com sucesso:', newMedia);

    // Testar consulta
    const mediaList = await Media.find();
    console.log(`📊 Total de mídias encontradas: ${mediaList.length}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Erro no teste:', err);
    process.exit(1);
  }
}

// Executar teste
testConnection();