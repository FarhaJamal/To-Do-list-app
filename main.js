document.addEventListener("DOMContentLoaded", () =>
{
    const taskInput = document.getElementById("task");
    const addTaskBtn = document.getElementById("submit");
    const taskList = document.getElementById("task-list");
    const emptyImage = document.querySelector(".empty-image");
    const todoCon = document.querySelector(".todo-con");
    const progressBar = document.getElementById("progress");
    const progressNum = document.getElementById("numbers");
    const progressMessage = document.getElementById("progress-message");

    let confettiShown = false; 

    const toggleEmptyState = () =>
    {
        emptyImage.style.display = taskList.children.length === 0 ? "block" : "none";
        todoCon.style.width = taskList.children.length > 0 ? "100%" : "50%"
    };

const updateProgress = (checkCompletion = true) => {
    const totalTasks = taskList.children.length;
    const completedTasks = taskList.querySelectorAll(".checkbox:checked").length;

    const percentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    progressBar.style.width = `${percentage}%`;
    progressNum.textContent = `${completedTasks} / ${totalTasks}`;

    if (totalTasks === 0) {
        progressMessage.textContent = "Start";
        confettiShown = false;
    } else if (completedTasks === totalTasks) {
        progressMessage.textContent = "You Did It!";
        if (!confettiShown && checkCompletion) 
        {
            Confetti();
            confettiShown = true;
        }
    } else {
        progressMessage.textContent = "Keep Going";
        confettiShown = false;
    }
};


    const saveTasksToLocalStorage = () =>
    {
        const tasks = Array.from(taskList.querySelectorAll("li")).map(li => 
            ({
                text: li.querySelector("span").textContent,
                completed: li.querySelector(".checkbox").checked
            }));
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    const loadTasksFromLocalStorage = () =>
    {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.forEach(({text, completed}) => addTask(text, completed));
        toggleEmptyState();
        updateProgress();
    }

    const addTask = (text, completed = false) => 
    {
        const taskText = text || taskInput.value.trim();
        if(!taskText)
        {
            return;
        }

        const li = document.createElement("li");
        li.innerHTML = 
        `
        <input type="checkbox" class="checkbox" ${completed ? "checked" : ""}/>
        <span>${taskText}</span>
        <div class="task-buttons">
                <button class="edit-btn">
                <i class="fa-solid fa-pen"></i>
                </button>
                <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
                </button>
        </div>
        `

        const checkbox = li.querySelector(".checkbox");
        const editBtn = li.querySelector(".edit-btn");

        if (completed)
        {
            li.classList.add("completed");
            editBtn.style.opacity = "0.5";
            editBtn.style.pointerEvents = "none";
        }

        checkbox.addEventListener("change", () =>
        {
            const isChecked = checkbox.checked;
            li.classList.toggle("completed", isChecked);
            editBtn.style.opacity = isChecked ? "0.5" : "1";
            editBtn.style.pointerEvents = isChecked ? "none" : "auto";
            updateProgress();
            saveTasksToLocalStorage();
        });

        editBtn.addEventListener("click", () =>
        {
            if(!checkbox.checked)
            {
                taskInput.value = li.querySelector("span").textContent;
                li.remove()
                toggleEmptyState();
                updateProgress(false);
                saveTasksToLocalStorage();
            }
        });

        li.querySelector(".delete-btn").addEventListener("click", () =>
        {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTasksToLocalStorage();
        })

        taskList.appendChild(li);
        taskInput.value = "";
        toggleEmptyState();
        updateProgress();
        saveTasksToLocalStorage();
    };

    addTaskBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addTask();
});

    taskInput.addEventListener("keypress", (e) =>
    {
        if(e.key === "Enter")
        {
            e.preventDefault();
            addTask();
        }
    });

    loadTasksFromLocalStorage();

});

const Confetti = ( ) => 
{
    const count = 200,
  defaults = {
    origin: { y: 0.7 },
  };

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

fire(0.25, {
  spread: 26,
  startVelocity: 55,
});

fire(0.2, {
  spread: 60,
});

fire(0.35, {
  spread: 100,
  decay: 0.91,
  scalar: 0.8,
});

fire(0.1, {
  spread: 120,
  startVelocity: 25,
  decay: 0.92,
  scalar: 1.2,
});

fire(0.1, {
  spread: 120,
  startVelocity: 45,
});
};