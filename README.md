## List all todos 

``` graphql
query getTodos {
  getAllTodos {
    name 
    completed
    date
    id
    priority
  }
}   
```

## Add a new todo: name: "Complete the final assessment"

``` graphql 
mutation newTodo {
  addTodo(name: "Complete the final assessment", priority: high) {
    name 
    id 
    completed
    date
  }
}
```

## Show the: "Completed final assessment" todo
``` graphql
query getSingleTodo {
  getTodo(id: 1) {
    name
    completed
    id
    date
  }
}
```

## Complete the: "Complete final assessment" todo

``` graphql 
mutation completeTodo {
  completeTodo(id: 1) {
    name
    completed
  }
}
```

## Show all complete todos

```graphql 
query getCompleted {
  getCompletedTodos {
    name
    date
    completed
    id
  }
}
```
## Show all incomplete todos
``` graphql
query getNotCompleted {
  getNotCompletedTodos {
    name 
    date 
    id 
    completed
  }
}
```
