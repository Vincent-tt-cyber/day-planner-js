document.addEventListener("DOMContentLoaded", () => {
  // Элементы DOM
  const taskInput = document.querySelector(".task-input");
  const addTaskBtn = document.querySelector(".addTaskBtn");
  const tasksContainer = document.querySelector("#tasksContainer");
  const tasksCount = document.querySelector(".tasksCount");
  const filterButtons = document.querySelectorAll(".filters button");
  const currentDateEl = document.querySelector("#currentDate");

  let updateInterval;

  function startUpdateInterval() {
    if (updateInterval) {
      clearInterval(updateInterval);
    }

    updateInterval = setInterval(() => renderTasks(), 60000);
  }

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
      title: taskTitle,
      completed: false,
      created_at: new Date(),
    };

    tasks.push(newTask);
    taskInput.value = "";
    taskInput.focus();

    saveTasks();
    renderTasks();
    startUpdateInterval();
  }

  // Сохранение задач в LocalStorage
  function saveTasks() {
    localStorage.setItem("tasksDB", JSON.stringify(tasks));
    updateTasksCount();
  }

  //   Обновление счетчика задач
  function updateTasksCount() {
    let activeTasks = tasks.filter((task) => !task.completed).length;

    tasksCount.textContent = `${activeTasks} ${
      activeTasks === 1
        ? "задача"
        : activeTasks >= 2 && activeTasks <= 4
        ? "задачи"
        : "задач"
    }`;
  }

  // Сменить статус задачи
  function toggleTask(id) {
    tasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    saveTasks();
    renderTasks();
    startUpdateInterval();
  }

  // Удалить задачу
  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
    startUpdateInterval();
  }

  startUpdateInterval();

  function setFilter(filter) {
    currentFilter = filter;

    filterButtons.forEach((btn) => {
      if (btn.dataset.filter === filter) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    renderTasks();
    updateTasksCount();
  }

  function getTimeDifference(createdDate) {
    const now = new Date();
    const created = new Date(createdDate);
    const diffMs = now - created;

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays}д ${Math.floor(diffHours % 24)}ч назад`;
    } else if (diffHours > 0) {
      return `${diffHours}ч ${diffMinutes % 60}м назад`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}м назад`;
    } else {
      return "только что";
    }
  }

  // Отобразить задачи
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

      const formatedDate = new Date(task.created_at).toLocaleString("ru-Ru", {
        day: "numeric",
        month: "2-digit",
        year: "2-digit",
        hour: "numeric",
        minute: "numeric",
      });

      const diffDateFormat = getTimeDifference(task.created_at);

      taskElement.innerHTML = `
        <div class="checkbox ${task.completed ? "active" : ""}">
          <div class="checkbox-bg"></div>
        </div>
         <div class="task-content"> <h4>${task.title}</h4>
          <p>${formatedDate} • ${diffDateFormat}</p>
         </div>
          <button class="delete-btn"></button>
      `;

      tasksContainer.appendChild(taskElement);

      // Обработка событий задач
      const checkbox = taskElement.querySelector(".checkbox");
      const deleteBtn = taskElement.querySelector(".delete-btn");

      checkbox.addEventListener("click", () => {
        toggleTask(task.id);
      });
      deleteBtn.addEventListener("click", () => deleteTask(task.id));
    });
  }

  // Обработка собыий
  addTaskBtn.addEventListener("click", addTask);

  // Обработка на клавишу Enter
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  // Обработка фильтров
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => setFilter(btn.dataset.filter));
  });

  updateTasksCount();
  renderTasks();
});
