document.addEventListener('DOMContentLoaded', () => {
    carregarTarefas();

    document.getElementById('tarefa-form').addEventListener('submit', (escolhido) => {
        escolhido.preventDefault();
        const titulo = document.getElementById('titulo').value;
        const descricao = document.getElementById('descricao').value;

        fetch('http://localhost:3000/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ titulo, descricao })
        })
        .then(response => response.json())
        .then(novaTarefa => {
            adicionarTarefaNaTela(novaTarefa);
            document.getElementById('titulo').value = '';
            document.getElementById('descricao').value = '';
        });
    }); 
});

function carregarTarefas() {
    fetch('http://localhost:3000/tarefas')
    .then(response => response.json())
    .then(tarefas => {
        tarefas.forEach(tarefa => adicionarTarefaNaTela(tarefa));
    });
}

function adicionarTarefaNaTela(tarefa) {
    const ul = document.getElementById('tarefas-lista');
    const li = document.createElement('li');
    
    li.setAttribute('data-id', tarefa.id);
    li.className = tarefa.concluida ? 'completed' : '';
    
    li.innerHTML = `
    ${tarefa.titulo} - ${tarefa.descricao}
    <button onclick="marcarComoConcluida(${tarefa.id})">${tarefa.concluida ? 'Concluída' : 'Marcar como Concluída'}</button>
    <button onclick="deletarTarefa(${tarefa.id})">Excluir</button>
    `;

    ul.appendChild(li);
}

function marcarComoConcluida(id) {
    fetch(`http://localhost:3000/tarefas/${id}`, { method: 'PATCH' })
        .then(response => response.json())
        .then(tarefaAtualizada => {
            const li = document.querySelector(`li[data-id="${id}"]`);
            li.classList.add('completed');
            li.querySelector('button').textContent = 'Concluída';
        });
}

function deletarTarefa(id) {
    fetch(`http://localhost:3000/tarefas/${id}`, { method: 'DELETE' })
        .then(() => {
            const li = document.querySelector(`li[data-id="${id}"]`);
            li.remove();
        });
}

function filtrarTarefas(filtro) {
    const ul = document.getElementById('tarefas-lista');
    ul.innerHTML = '';
    
    fetch('http://localhost:3000/tarefas')
        .then(response => response.json()) // logica desgraçada, mas basicamente tarefasFiltradas serao só tarefas a n ser que tenha alguma espécie de filtro lá sla ok obg
        .then(tarefas => {
            let tarefasFiltradas = tarefas;
            if (filtro === 'todos') {
                tarefasFiltradas = tarefas;
            } else if (filtro === 'pendentes') {
                tarefasFiltradas = tarefas.filter(t => !t.concluida);
            } else if (filtro === 'concluidas') {
                tarefasFiltradas = tarefas.filter(t => t.concluida);
            }
            tarefasFiltradas.forEach(tarefa => adicionarTarefaNaTela(tarefa));
        });
}
