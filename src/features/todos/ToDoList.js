import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../../api/todosApi";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const ToDoList = () => {
  const [newTodo, setNewTodo] = useState('')
  const queryClient = useQueryClient()  

  const {
    isLoading,
    isError,
    error,
    data: todos
  } = useQuery('todos', getTodos, { // this last piece is a selector, which allows us to make edits to the data before it is retrieved 
    select: data => data.sort((a,b) => b.id - a.id) // sorts our ID's in reverse order 
  }) // useQuery is used to fetch some data, the 'todo' is the unique key of the query/fetch, and getTodos is a function that returns a promise that resolves the data 
  // unique key is used internally for refetching, caching, and sharing your queries throughout the application 

  const addTodoMutation = useMutation(addTodo, {
    onSuccess: () => {
      // Invalidates cache and refetch 
      queryClient.invalidateQueries("todos") // invalidating the unique key's cached data and refetches
    }
  })

  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: () => {
      // Invalidates cache and refetch 
      queryClient.invalidateQueries("todos")
    }
  })

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      // Invalidates cache and refetch 
      queryClient.invalidateQueries("todos")
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault(); // make sure submit of form (which this handleSubmit will be used for) does not reload the page 
    addTodoMutation.mutate({ userId: 1, title: newTodo, completed: false }) // 
    setNewTodo('')
  }

  const newItemSection = ( // handleSubmit is above and states that on submission of form, that function should run 
    <form onSubmit={handleSubmit}> 
        <label htmlFor="new-todo">Enter a new todo item</label>
        <div className="new-todo">
            <input
                type="text"
                id="new-todo"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Enter new todo"
            />
        </div>
        <button className="submit">
            <FontAwesomeIcon icon={faUpload} />
        </button>
    </form>
  )

  let content 
  if(isLoading) {
    content = <p>Loading...</p>
  } else if (isError){
    content = <p>{error.message}</p>
  } else{
    content = todos.map((todo) => {
      return (
          <article key={todo.id}>
              <div className="todo">
                  <input
                      type="checkbox"
                      checked={todo.completed}
                      id={todo.id}
                      onChange={() =>
                          updateTodoMutation.mutate({ ...todo, completed: !todo.completed })
                      }
                  />
                  <label htmlFor={todo.id}>{todo.title}</label>
              </div>
              <button className="trash" onClick={() => deleteTodoMutation.mutate({ id: todo.id })}>
                  <FontAwesomeIcon icon={faTrash} />
              </button>
          </article>
      )
  })
  }



  return (
    <main>
      <h1>Todo List</h1>
      {newItemSection}
      {content}
    </main>
    )
};

export default ToDoList;
