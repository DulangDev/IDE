window.onload = ()=>{
    let kb_todo = document.getElementById("kb_todo");
    let kb_progress = document.getElementById("kb_progress");
    let kb_done = document.getElementById("kb_done");

    let progress_bar = document.getElementById("progress-bar");

    let complexity_rep = [
        "easy",
        "medium",
        "complex",
        "hard"
    ];

    let complexity_colors = [
        "green",
        "yellow",
        "#ff8f00",
        "red"
    ];

    function make_task (taskinfo){
        let new_task = document.createElement("div");
        new_task.classList.add("kanban-task");

        new_task.innerHTML = `
                <div>Task: ${taskinfo.desc}</div>
                <div class="complexity" style="background: ${complexity_colors[taskinfo.complexity]}" >
                    ${complexity_rep[taskinfo.complexity || 0]}
                </div>`;
        new_task.onclick = ()=>{

          window.location.href = "http://vk.me/dulangdev"
        };
        return new_task;
    }



    function load_tasks(){
        fetch("/tasks").then( r=> r.json()).then( all_tasks => {
            let todo_complexity = 0, progress_complexity = 0, done_complexity = 0;
            all_tasks.forEach( task=>{

                let task_node = make_task(task);
                switch (task.cat) {
                    case "todo":
                        kb_todo.appendChild(task_node);
                        todo_complexity += task.complexity + 1;
                        break;
                    case "progress":
                        kb_progress.appendChild(task_node);
                        progress_complexity += task.complexity + 1;
                        break;
                    case "done":
                        kb_done.appendChild(task_node);
                        done_complexity += task.complexity + 1;
                        break;
                    default:break;
                }
            } );

            let percentage = Math.round((done_complexity + progress_complexity * 0.5) / (done_complexity + progress_complexity + todo_complexity) * 100);
            progress_bar.style.width =   Math.max(percentage, 10) + "%";
            progress_bar.innerText = percentage + "%";
        }) ;


    }
    load_tasks();

};

