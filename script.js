const apikey = '0193be9f-cc36-4ec3-ad11-a73c46432faa';
const apihost = 'https://todo-api.coderslab.pl';

if (apikey == '') {
    alert('Wejdź na https://todo-api.coderslab.pl/apikey/create oraz skopiuj token i wklej do stałej "apikey", w pliku script.js. Inaczej nic się nie uda!');
}


function apiListAllTasks() {
    return fetch(
        apihost + '/api/tasks',
        {headers: {'Authorization': apikey}}
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    );
}

function apiCreateTask(title, description) {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({title: title, description: description, status: 'open'}),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    );
}

function apiUpdateTask(taskId, title, description, status) {
    return fetch(
        apihost + '/api/tasks/' + taskId,
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({title: title, description: description, status: status}),
            method: 'PUT'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    );
}

function apiDeleteTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId,
        {
            headers: {Authorization: apikey},
            method: 'DELETE'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function apiListOperationsForTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations',
        {headers: {'Authorization': apikey}}
    ).then(
        function (resp) {
            return resp.json();
        }
    );
}

function apiCreateOperationForTask(taskId, description) {
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations',
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({description: description, timeSpent: 0}),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    );
}

function apiUpdateOperation(operationId, description, timeSpent) {
    return fetch(
        apihost + '/api/operations/' + operationId,
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({description: description, timeSpent: timeSpent}),
            method: 'PUT'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    );
}

function apiDeleteOperation(operationId) {
    return fetch(
        apihost + '/api/operations/' + operationId,
        {
            headers: {Authorization: apikey},
            method: 'DELETE'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function renderTask(taskId, title, description, status) {
    const section = document.createElement('section');
    //section.className = 'card mt-5 shadow-sm';
    section.style = 'margin-top: 30px;box-shadow: 5px 10px #888888';
    document.querySelector('main').appendChild(section);

    const main = document.querySelector('main')
    main.style = 'background-color: #C0FF33'

    const mainDiv = document.querySelector('main div')
    mainDiv.style = 'background-color: #EFFEC7; box-shadow: 5px 10px #888888;'
    mainDiv.classList.remove('card', 'shadow')

    const headerDiv = document.createElement('div');
    headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
    headerDiv.style = 'background-color: #DECADE'
    section.appendChild(headerDiv);

    const headerLeftDiv = document.createElement('div');
    headerDiv.appendChild(headerLeftDiv);

    const h5 = document.createElement('h5');
    h5.innerText = title;
    headerLeftDiv.appendChild(h5);

    const h6 = document.createElement('h6');
    h6.className = 'card-subtitle text-muted';
    h6.innerText = description;
    headerLeftDiv.appendChild(h6);

    const headerRightDiv = document.createElement('div');
    headerDiv.appendChild(headerRightDiv);


    if (status == 'open') {
        const finishButton = document.createElement('button');
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
        finishButton.innerText = 'Finish';
        finishButton.style = "box-shadow: 5px 10px #888888"
        headerRightDiv.appendChild(finishButton);
        finishButton.addEventListener('click', function () {
            apiUpdateTask(taskId, title, description, 'closed');
            section.querySelectorAll('.js-task-open-only').forEach(
                function (element) {
                    element.parentElement.removeChild(element);
                }
            );
        });
    }


    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'Delete';
    deleteButton.style = "box-shadow: 5px 10px #888888;"
    headerRightDiv.appendChild(deleteButton);
    deleteButton.addEventListener('click', function () {
        apiDeleteTask(taskId).then(function () {
            section.parentElement.removeChild(section);
        });
    });

    const ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';
    section.appendChild(ul);


    apiListOperationsForTask(taskId).then(
        function (response) {
            response.data.forEach(
                function (operation) {
                    renderOperation(ul, status, operation.id, operation.description, operation.timeSpent);
                }
            )
        }
    )

    if (status == 'open') {
        const addOperationDiv = document.createElement('div');
        addOperationDiv.className = 'card-body js-task-open-only';
        section.appendChild(addOperationDiv);

        const form = document.createElement('form');
        addOperationDiv.appendChild(form);

        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        form.appendChild(inputGroup);

        const descriptionInput = document.createElement('input');
        descriptionInput.setAttribute('type', 'text');
        descriptionInput.setAttribute('placeholder', 'Write something');
        descriptionInput.setAttribute('minlength', '3');
        descriptionInput.className = 'form-control';
        inputGroup.appendChild(descriptionInput);

        const inputGroupAppend = document.createElement('div');
        inputGroupAppend.className = 'input-group-append';
        inputGroup.appendChild(inputGroupAppend);

        const addButton = document.createElement('button');
        addButton.className = 'btn btn-info';
        addButton.innerText = 'Add';
        inputGroupAppend.appendChild(addButton);

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            apiCreateOperationForTask(taskId, descriptionInput.value).then(
                function (response) {
                    renderOperation(
                        ul,
                        status,
                        response.data.id,
                        response.data.description,
                        response.data.timeSpent
                    );
                }
            )
        });
        const lastButton = document.getElementById("lastButton")
        lastButton.style = "box-shadow: 5px 10px #888888";
    }
}

function renderOperation(ul, status, operationId, operationDescription, timeSpent) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    ul.appendChild(li);

    const listColor = document.querySelectorAll('section ul li')
    listColor.forEach(function (item) {
        item.style = 'background-color: #1CE';
    })

    const descriptionDiv = document.createElement('div');
    descriptionDiv.innerText = operationDescription;
    li.appendChild(descriptionDiv);


    const time = document.createElement('span');
    time.className = 'badge badge-success badge-pill ml-2';
    time.innerText = formatTime(timeSpent);
    descriptionDiv.appendChild(time);


    if (status == "open") {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'js-task-open-only';
        li.appendChild(controlDiv);

        let seconds = timeSpent * 60;
        let timerek = document.createElement('button');
        timerek.className = 'btn btn-outline-danger btn-sm';
        timerek.style = "box-shadow: 5px 10px #888888; margin-right: 7px"
        controlDiv.appendChild(timerek);

        setInterval(function odliczanie() {
            seconds = seconds - 1;
            timerek.innerText = formatTime2(seconds);
        }, 1000);


        const add15minButton = document.createElement('button');
        add15minButton.className = 'btn btn-outline-success btn-sm mr-2';
        add15minButton.innerText = '+15m';
        add15minButton.style = "box-shadow: 5px 10px #888888;"
        controlDiv.appendChild(add15minButton);

        add15minButton.addEventListener('click', function () {
            apiUpdateOperation(operationId, operationDescription, timeSpent + 15).then(
                function (response) {
                    seconds = seconds + (15 * 60);
                    time.innerText = formatTime(response.data.timeSpent);
                    timeSpent = response.data.timeSpent;
                }
            );
        });

        const add1hButton = document.createElement('button');
        add1hButton.className = 'btn btn-outline-success btn-sm mr-2';
        add1hButton.innerText = '+1h';
        add1hButton.style = "box-shadow: 5px 10px #888888;"
        controlDiv.appendChild(add1hButton);

        add1hButton.addEventListener('click', function () {
            apiUpdateOperation(operationId, operationDescription, timeSpent + 60).then(
                function (response) {
                    time.innerText = formatTime(response.data.timeSpent);
                    timeSpent = response.data.timeSpent;
                    seconds = seconds + (60 * 60);
                }
            );
        });

        const resetButton = document.createElement('button');
        resetButton.className = 'btn btn-outline-danger btn-sm';
        resetButton.innerText = 'Reset';
        resetButton.style = "margin-right: 7px; box-shadow: 5px 10px #888888;"
        controlDiv.appendChild(resetButton);
        resetButton.addEventListener('click', function () {
            apiUpdateOperation(operationId, operationDescription, timeSpent = 0).then(
                function (response) {
                    time.innerText = formatTime(response.data.timeSpent);
                    timeSpent = response.data.timeSpent;
                    seconds = seconds * 0;
                }
            )
        })

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-outline-danger btn-sm';
        deleteButton.innerText = 'Delete';
        deleteButton.style = "box-shadow: 5px 10px #888888";
        controlDiv.appendChild(deleteButton);

        deleteButton.addEventListener('click', function () {
            apiDeleteOperation(operationId).then(
                function () {
                    li.parentElement.removeChild(li);
                }
            );
        });


    }
}


function formatTime(total) {
    const hours = Math.floor(total / 60);
    const minutes = total % 60;
    if (hours > 0) {
        return hours + 'h ' + minutes + 'm';
    } else {
        return minutes + 'm';
    }

}

function formatTime2(seconds) {
    const hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds / 60) % 60);
    let secondsN = seconds % 60;
    if (minutes < 1 && hours < 1){
        secondsN = 0;
    }
    if (secondsN < 0) {
        minutes = minutes - 1 ;
        secondsN = 59;
    }
    if (hours > 0) {
        return hours + 'h ' + minutes + 'm ' + secondsN + 's';
    } else if (minutes > 0) {
        return minutes + 'm ' + secondsN + 's';
    } else {
        return secondsN + 's'
    }

}


document.addEventListener('DOMContentLoaded', function () {
    apiListAllTasks().then(
        function (response) {
            response.data.forEach(
                function (task) {
                    renderTask(task.id, task.title, task.description, task.status);
                }
            )
        }
    );
    document.querySelector('.js-task-adding-form').addEventListener('submit', function (event) {
        event.preventDefault();
        apiCreateTask(event.target.elements.title.value, event.target.elements.description.value).then(
            function (response) {
                renderTask(response.data.id, response.data.title, response.data.description, response.data.status)
            }
        )
    });
    document.body.style = "background-color: blue"


});
