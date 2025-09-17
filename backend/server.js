const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const cors = require('cors')

app.use(cors())

app.use(express.json()); // como opção secundária, dava pra usar o parseint, que faz a analise e parse dos dados de entrada contidos no corpo da requisição, disponibilizando as propriedades do req (pelo menos, de acordo com o google)

let tarefas = [
    { id: 1, titulo: "Planejar o sprint", descricao: "Definir as próximas atividades do time de desenvolvimento", concluida: false },
    { id: 2, titulo: "Revisar o código", descricao: "Revisar o código do módulo de autenticação", concluida: true },
    { id: 3, titulo: "Escrever testes unitários", descricao: "Criar testes para a API de login", concluida: false }
];


app.get('/tarefas', (req, res) => {
    res.status(200).json(tarefas)
})
app.post('/tarefas', (req, res) => {
    const { titulo, descricao } = req.body;
    const id = tarefas.length ? tarefas[tarefas.length - 1].id + 1 : 1;
    const novaTarefa = { id, titulo, descricao, concluida: false };
    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);
});

app.patch('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const tarefa = tarefas.find(tarefinha => tarefinha.id === parseInt(id));

    if (!tarefa) {
        return res.status(404).json({ error: "Tarefa não encontrada!" });
    }

    tarefa.concluida = !tarefa.concluida;
    res.status(200).json(tarefa);
});

app.delete('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const coisa = tarefas.findIndex(tarefinha => tarefinha.id === parseInt(id));

    if (coisa === -1) {
        return res.status(404).json({ error: "Tarefa não encontrada!" });
    }

    tarefas.splice(coisa, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
