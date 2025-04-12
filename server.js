const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Configuração do MongoDB em memória
let mongoServer;
async function connectDB() {
  try {
    // Tentativa com MongoDB em memória
    console.log('🔄 Iniciando MongoDB em memória...');
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ Conectado ao MongoDB em memória');
    return;
  } catch (memError) {
    console.warn('⚠️ Falha no MongoDB em memória, tentando MongoDB local...', memError.message);
  }

  // Fallback para MongoDB local
  try {
    await mongoose.connect('mongodb://localhost:27017/karateDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Conectado ao MongoDB local');
  } catch (localError) {
    console.error('❌ Falha ao conectar ao MongoDB local:', localError.message);
    throw new Error('Não foi possível conectar a nenhum banco de dados');
  }
}
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
// Conectar ao banco de dados
connectDB().catch(err => console.error('Erro ao conectar MongoDB:', err));

// Fechar conexão ao encerrar
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
  process.exit(0);
});

// Configuração do CORS para desenvolvimento
app.use(cors({
  origin: 'http://localhost:8000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Rotas da API
const mediaRoutes = require('./routes/media');
app.use('/api/media', mediaRoutes);

// Rota básica
app.get('/', (req, res) => {
  res.send('API da Academia de Karatê - Versão 1.0');
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Erro interno no servidor',
    message: err.message 
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});