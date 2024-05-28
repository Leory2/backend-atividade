const express = require('express');
const app = express();
const port = 3000;

// Array de exemplo
let estudantes = [
  { id: 1, aluno: "Ruan Polovina", curso: "TI", isntituiçao: "SENAI" },
  { id: 2, aluno: "Leonardo", curso: "TI", isntituiçao: "SENAI"  },
  { id: 3, aluno: "Eric", curso: "TI", isntituiçao: "SENAI"},
];

// Middleware para permitir acesso a partir de qualquer origem (CORS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware para processar JSON no corpo da requisição
app.use(express.json());



// Rota para obter todos os servidores
app.get('/estudantes/listar', (req, res) => {
  res.json(estudantes);
});

// Rota para obter um servidor por ID
app.get('/estudantes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`Recebida requisição GET para ID: ${id}`);
  const estudante = estudantes.find(s => s.id === id);
  if (estudante) {
    res.json(estudante);
  } else {
    res.status(404).send('Aluno não encontrado');
  }
});

// Rota para adicionar um novo servidor
app.post('/estudantes/inserir', (req, res) => {
  const novoServidor = req.body;
  novoServidor.id = estudantes.length ? estudantes[estudantes.length - 1].id + 1 : 1;
  estudantes.push(novoServidor);
  res.status(201).json(novoServidor);
});

// Rota para atualizar um servidor existente
app.put('/estudantes/atualizar/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`Recebida requisição PUT para ID: ${id} com dados: `, req.body);
  const index = estudantes.findIndex(s => s.id === id);
  if (index !== -1) {
    estudantes[index] = { ...estudantes[index], ...req.body };
    res.json(estudantes[index]);
  } else {
    res.status(404).send('Aluno não encontrado');
  }
});

// Rota para excluir um servidor
app.delete('/estudantes/excluir/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`Recebida requisição DELETE para ID: ${id}`);
  estudantes = estudantes.filter(s => s.id !== id);
  res.status(204).send("Não foi póssivel deletar aluno");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
