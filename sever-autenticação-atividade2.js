const express = require('express'); // Importa o módulo express
const basicAuth = require('basic-auth'); // Importa o módulo basic-auth
const app = express(); // Cria uma instância do express
const port = 3000; // Define a porta em que o servidor irá rodar

let estudantes = []; // Cria um array para armazenar os estudantes

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

// Rota para adicionar estudantes
app.post('/estudantes', authenticate, (req, res) => {
  const estudante = req.body;
  if (!estudante.nome || !estudante.idade) {
    return res.status(400).json({ message: 'Nome e idade são obrigatórios' });
  }
  estudantes.push(estudante);
  res.status(200).json({ message: 'Estudante adicionado com sucesso', estudante });
});

// Rota para listar todos os estudantes
app.get('/estudantes', authenticate, (req, res) => {
  res.status(200).json(estudantes);
});

// Rota para obter um estudante por nome
app.get('/estudantes/:nome', authenticate, (req, res) => {
  const nome = req.params.nome;
  const estudante = estudantes.find(est => est.nome === nome);

  if (!estudante) {
    return res.status(404).json({ message: 'Estudante não encontrado' });
  }
  res.status(200).json(estudante);
});

// Inicia o servidor na porta especificada
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`); // Loga a URL do servidor
});
