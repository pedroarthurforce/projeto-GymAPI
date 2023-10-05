const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração da conexão com o MySQL
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '0000',
  database: 'exercicios'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL');
});

// Middleware para permitir o uso de JSON
app.use(express.json());

// Rotas CRUD para Exercícios
app.post('/exercicios', (req, res) => {
  const { nome, peso } = req.body;

  connection.query(
    'INSERT INTO exercicios (nome, peso) VALUES (?, ?)',
    [nome, peso],
    (err, results) => {
      if (err) {
        console.error('Erro ao inserir exercício:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      res.status(201).json({ id: results.insertId, nome, peso });
    }
  );
});

app.get('/exercicios', (req, res) => {
  connection.query('SELECT * FROM exercicios', (err, results) => {
    if (err) {
      console.error('Erro ao obter exercícios:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
      return;
    }
    res.json(results);
  });
});

app.get('/exercicios/:id', (req, res) => {
  const exercicioId = req.params.id;
  connection.query('SELECT * FROM exercicios WHERE id = ?', [exercicioId], (err, results) => {
    if (err) {
      console.error('Erro ao obter exercício por ID:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Exercício não encontrado' });
      return;
    }
    res.json(results[0]);
  });
});

app.put('/exercicios/:id', (req, res) => {
  const exercicioId = req.params.id;
  const { nome, peso } = req.body;

  connection.query(
    'UPDATE exercicios SET nome = ?, peso = ? WHERE id = ?',
    [nome, peso, exercicioId],
    (err, results) => {
      if (err) {
        console.error('Erro ao atualizar exercício:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Exercício não encontrado' });
        return;
      }
      res.json({ id: exercicioId, nome, peso });
    }
  );
});

app.delete('/exercicios/:id', (req, res) => {
  const exercicioId = req.params.id;

  connection.query('DELETE FROM exercicios WHERE id = ?', [exercicioId], (err, results) => {
    if (err) {
      console.error('Erro ao excluir exercício:', err);
      res.status(500).json({ error: 'Erro interno do servidor' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Exercício não encontrado' });
      return;
    }
    res.json({ message: 'Exercício excluído com sucesso' });
  });
});

// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
