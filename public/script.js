document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
  fetch('/tasks')
    .then(response => response.json())
    .then(tasks => {
      const taskList = document.getElementById('taskList');
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.toggle('completed', task.completed);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.classList.add('task-checkbox');
        checkbox.onchange = () => toggleTaskCompletion(task.id, checkbox.checked);

        const taskTitle = document.createElement('span');
        taskTitle.textContent = task.title;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Remover';
        deleteButton.onclick = () => removeTask(task.id);

        const taskActions = document.createElement('div');
        taskActions.classList.add('task-actions');
        taskActions.appendChild(checkbox);
        taskActions.appendChild(deleteButton);

        taskItem.appendChild(taskTitle);
        taskItem.appendChild(taskActions);
        taskList.appendChild(taskItem);
      });
    });
}

function addTask() {
  const taskTitle = document.getElementById('taskTitle').value;
  fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: taskTitle, completed: false })
  }).then(() => {
    document.getElementById('taskTitle').value = '';
    loadTasks();
  });
}

function toggleTaskCompletion(id, completed) {
  fetch(`/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  }).then(() => loadTasks());
}

function removeTask(id) {
  fetch(`/tasks/${id}`, { method: 'DELETE' }).then(() => loadTasks());
}
