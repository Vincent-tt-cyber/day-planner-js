document.addEventListener("DOMContentLoaded", () => {
  // Элементы DOM
  const taskInput = document.querySelector(".task-input");
  const addTaskBtn = document.querySelector(".addTaskBtn");
  const tasksContainer = document.querySelector("#tasksContainer");
  const tasksCount = document.querySelector(".tasksCount");
  const filterButtons = document.querySelectorAll(".filters button");
  const currentDateEl = document.querySelector("#currentDate");

  //   Обновления дату
  function updateDate() {
    const now = new Date().toLocaleString("ru-RU", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    currentDateEl.textContent = now;
  }

  updateDate();

  //   Загрузка задач из LocalStorage
  let tasks = JSON.parse(localStorage.getItem("tasksDB")) || [];

  //   фильтр по умолчанию
  let currentFilter = "all";

  // Добавление задачи
  function addTask() {
    const taskTitle = taskInput.value.trim();

    if (!taskTitle) return;

    const newTask = {
      id: Date.now(),
      taskTitle,
      completed: false,
      created_at: new Date(),
    };

    tasks.push(newTask);
    taskInput.value = "";
    taskInput.focus();

    saveTasks();
    renderTasks();
  }

  // Сохранение задач в LocalStorage
  function saveTasks() {
    localStorage.setItem("tasksDB", JSON.stringify(tasks));
    updateTasksCount();
  }

  //   Обновление счетчика задач
  function updateTasksCount() {
    const activeTasks = tasks.filter((task) => !task.completed).length;
    tasksCount.textContent = `${activeTasks} ${
      activeTasks === 1
        ? "задача"
        : activeTasks >= 2 && activeTasks <= 4
        ? "задачи"
        : "задач"
    }`;
  }

  //   Отобразить задачи
  function renderTasks() {
    let filteredTasks = tasks;

    if (currentFilter === "active") {
      filteredTasks = tasks.filter((task) => !task.completed);
    } else if (currentFilter === "completed") {
      filteredTasks = tasks.filter((task) => task.completed);
    }

    tasksContainer.innerHTML = "";

    if (filteredTasks.length === 0) {
      tasksContainer.innerHTML = `
            <div class="task" style="text-align: center; justify-content: center; animation: none;">
                <div class="task-content" style="justify-content: center; animation: none;">
                ${
                  currentFilter === "all"
                    ? "Нет задач"
                    : currentFilter === "active"
                    ? "Нет активных задач"
                    : "Нет завершенных задач"
                }</div>
            </div>
        `;
      return;
    }

    filteredTasks.forEach((task) => {
      const taskElement = document.createElement("div");
      taskElement.className = `task ${task.completed ? "completed" : ""}`;
      taskElement.setAttribute("data-id", task.id);

      taskElement.innerHTML = `
        <div class="checkbox">
           <input type="checkbox"/>
        </div>
         <div class="task-content">${task.text}</div>\
          <button class="delete-btn">+</button>
      `;

      tasksContainer.appendChild(taskElement);
    });
  }

  updateTasksCount();
  renderTasks();
});
