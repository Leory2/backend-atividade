const express = require('express'); // Importa o módulo express
const multer = require('multer'); // Importa o módulo multer
const basicAuth = require('basic-auth'); // Importa o módulo basic-auth
const path = require('path'); // Importa o módulo path
const fs = require('fs'); // Importa o módulo fs
const app = express(); // Cria uma instância do express
const port = 3000; // Define a porta em que o servidor irá rodar

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define o diretório onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Define o nome do arquivo
  }
});
const upload = multer({ storage: storage });

// Middleware para permitir acesso a partir de qualquer origem (CORS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Permite acesso de qualquer origem
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // Permite esses cabeçalhos na requisição
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS"); // Permite esses métodos HTTP
  if (req.method === 'OPTIONS') { // Verifica se o método é OPTIONS
    return res.sendStatus(200); // Responde com status 200 OK para requisições OPTIONS
  }
  next(); // Chama o próximo middleware
});

// Middleware para processar JSON no corpo da requisição
app.use(express.json()); // Habilita o processamento de JSON nas requisições

// Middleware de autenticação básica
const authenticate = (req, res, next) => {
  const user = basicAuth(req);
  const validUser = 'admin' ;
  const validPassword = 'senha123';

  if (user && user.name === validUser && user.pass === validPassword) {
    return next(); // Usuário autenticado com sucesso
  } else {
    res.set('WWW-Authenticate', 'Basic realm="401"'); // Solicita credenciais de autenticação
    return res.status(401).send('Autenticação necessária'); // Responde com status 401 Unauthorized
  }
};

// Rota para upload de arquivos
app.post('/upload', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhum arquivo enviado' });
  }
  res.status(200).json({ message: 'Arquivo enviado com sucesso', file: req.file });
});

// Rota para download de arquivos
app.get('/download/:filename', authenticate, (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'uploads', filename);

  // Verifica se o arquivo existe
  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: 'Arquivo não encontrado' });
    }
    res.sendFile(filepath);
  });
});

// Inicia o servidor na porta especificada
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`); // Loga a URL do servidor
});
