const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Criação da tabela de tarefas
db.serialize(() => {
  db.run(`CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0
  )`);
});

module.exports = db;