/*
    todoList的介面
    <div class='todo' data-id=${id}>
        <li class='todo-item'>${This is todoTask}</li>
        <button class='complete-btn'>O</button>        
        <button class='complete-btn'>X</button>
    </div>
*/

//Selectors
const todoInput = document.querySelector('.todo-input')
const todoBtn = document.querySelector('.todo-button')
const todoList = document.querySelector('.todo-list')
const filterOption = document.querySelector('.filter-todo')

//Event Listeners
document.addEventListener('DOMContentLoaded', loadRender)
todoBtn.addEventListener("click", addTodo)
todoList.addEventListener('click', deleteCheck)
filterOption.addEventListener('click', filterTodo)

//Data & id
    let todoData = []
    let id = 1
    if(localStorage.getItem('id-index')){ 
        let index = (JSON.parse(localStorage.getItem('id-index')))
        id = index
    }

//Functions
function addTodo(e){
     //阻止表單送出
    e.preventDefault()
    if(!todoInput.value){
        alert('type something!')
        return
    }    

    if(localStorage.getItem('todoData')){  
        id++
    }

    //每次add的時候push一個obj到[]
    todoData.push({
        text: todoInput.value,
        isCompleted: false,
        id
    })


    const todoDiv = document.createElement('div')
    todoDiv.classList.add('todo')
    todoDiv.setAttribute('data-id', `${id}`)

    // <li>
    const newTodo = document.createElement('li')
    newTodo.innerText = todoInput.value
    newTodo.classList.add('todo-item')
    todoDiv.appendChild(newTodo)

    // <button>checked
    const completedBtn = document.createElement('button')
    completedBtn.classList.add("complete-btn")
    completedBtn.innerHTML = 'O'
    todoDiv.appendChild(completedBtn)
    
    //<button>deleted
    const trashBtn = document.createElement('button')
    trashBtn.classList.add("trash-btn")    
    trashBtn.innerHTML = 'X'
    todoDiv.appendChild(trashBtn)

    //Appen to list
    todoList.appendChild(todoDiv)
   

    //Clear todo Input value
    todoInput.value = ''  

    // setItem把input value存入localStorage
    savelocal()
}

function deleteCheck(e){
    const item = e.target
    const todo = item.parentElement                
    const id = Number(todo.getAttribute('data-id'))
    if (item.classList[0] === 'trash-btn'){
        todo.classList.add('fall')
        todo.addEventListener('transitionend', function(){
            todoData = todoData.filter(element => element.id !== Number(id))
            localStorage.setItem('todoData', JSON.stringify(todoData))
            todo.remove()
        })        
    }

    if(item.classList[0] === 'complete-btn'){
        const todoItem = item.parentElement.querySelector('.todo-item')
        todoItem.classList.toggle('completed-line')
        todo.classList.toggle('completed')  

        todoData = todoData.map(element =>{
            if(element.id === id){
                return{
                    ...element,
                    isCompleted: !element.isCompleted
                }
            }else{
                return element
            }
        })
        console.log(todoData)          
    }
    savelocal()
}

function filterTodo(e){
    const todoA = document.querySelectorAll('.todo')

    todoA.forEach(function(ele){
        if(e.target.value === 'all'){
            ele.style.display = 'flex'
        }
        else if(e.target.value === 'completed'){
            if(ele.classList.contains('completed')){
                ele.style.display = 'flex'                
            }else{
                ele.style.display = 'none'
            }
        }
        else{
            if(ele.classList.contains('completed')){
                ele.style.display = 'none'                
            }else{
                ele.style.display = 'flex'
            }
        }
    })
}

function savelocal(){
    localStorage.setItem('todoData', JSON.stringify(todoData))
    localStorage.setItem('id-index', JSON.stringify(id))
}

//DOMcontentloaded > getItem > render
function loadRender(){
    if(localStorage.getItem('todoData') === null){
        return
    }else{             
        todoData = JSON.parse(localStorage.getItem('todoData'))
    }
    
    todoData.forEach(function(element){        
        const todoDiv = document.createElement('div')
        todoDiv.classList.add('todo')        
        todoDiv.setAttribute('data-id',`${element.id}`)
        // <li>
        const newTodo = document.createElement('li')
        newTodo.innerText = element.text
        newTodo.classList.add('todo-item')
        todoDiv.appendChild(newTodo)

        // <button>checked
        const completedBtn = document.createElement('button')
        completedBtn.classList.add("complete-btn")
        completedBtn.innerHTML = 'O'
        todoDiv.appendChild(completedBtn)
        
        //<button>deleted
        const trashBtn = document.createElement('button')
        trashBtn.classList.add("trash-btn")    
        trashBtn.innerHTML = 'X'
        todoDiv.appendChild(trashBtn)

        //if(element的class裡面有completed屬性) > 就加上去
        if(element.isCompleted === true){
            todoDiv.classList.add('completed')
            newTodo.classList.add('completed-line')
        }else{
            todoDiv.classList.remove('completed')
            newTodo.classList.remove('completed-line')
        }
        //Appen to list
        todoList.appendChild(todoDiv)
    })
}