// Seleção de elementos do DOM
const todoForm = document.getElementById('todoForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const clearAllBtn = document.getElementById('clearAllBtn');

// Estado da Aplicação
let tasks = JSON.parse(localStorage.getItem('checklist_tasks')) || [];

// Regra de Negócio: Se for uma nova sessão do navegador (aba reaberta), pode optar por limpar.
// Para este exemplo, mantemos o comportamento de manter os dados ao recarregar a página atual.

function saveAndRender() {
    localStorage.setItem('checklist_tasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';
    let completedCount = 0;

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
            <span>${task.text}</span>
        `;
        
        if(task.completed) completedCount++;
        taskList.appendChild(li);
    });

    // Atualiza a Barra de Progresso
    const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
    progressBar.style.width = `${progressPercent}%`;
    progressText.textContent = `${progressPercent}% concluído (${completedCount}/${tasks.length})`;
}

// Evento: Adicionar Tarefa
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    tasks.push({ text: taskInput.value, completed: false });
    taskInput.value = '';
    saveAndRender();
});

// Evento: Marcar/Desmarcar (Delegação de Eventos)
taskList.addEventListener('change', (e) => {
    if(e.target.matches('input[type="checkbox"]')) {
        const index = e.target.dataset.index;
        tasks[index].completed = e.target.checked;
        saveAndRender();
    }
});

// Evento: Limpar Tudo
clearAllBtn.addEventListener('click', () => {
    tasks = [];
    saveAndRender();
});

// Inicialização
renderTasks();
