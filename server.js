const express = require('express');
const app = express();
const PORT = 3302;
const db = require('./db');

app.use(express.json());
app.use(express.static('public'));

// Criação de tarefa
app.post('/tasks', (req, res) => {
  const { title, completed } = req.body;
  if (!title) return res.status(400).send('Título da tarefa é obrigatório');
  db.run(`INSERT INTO tasks (title, completed) VALUES (?, ?)`, [title, completed], function(err) {
    if (err) return res.status(500).send(err.message);
    res.status(201).json({ id: this.lastID, title, completed });
  });
});

// Listagem de tarefas
app.get('/tasks', (req, res) => {
  db.all(`SELECT * FROM tasks`, [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// Atualização de tarefa (concluída ou não)
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  db.run(`UPDATE tasks SET completed = ? WHERE id = ?`, [completed, id], function(err) {
    if (err) return res.status(500).send(err.message);
    res.status(200).send();
  });
});

// Remoção de tarefa
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM tasks WHERE id = ?`, id, function(err) {
    if (err) return res.status(500).send(err.message);
    res.status(204).send();
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
