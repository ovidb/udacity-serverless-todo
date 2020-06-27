import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodoAccess()

export const getTodo = async (
  userId: string,
  todoId: string
): Promise<TodoItem[]> => {
  return todoAccess.getTodo(userId, todoId)
}

export const getAllTodos = async (userId: string): Promise<TodoItem[]> => {
  return todoAccess.getAllTodos(userId)
}

export const createTodo = async (
  { name, dueDate }: CreateTodoRequest,
  userId: string
): Promise<TodoItem> => {
  const createdAt = new Date().toISOString()
  const todoId = uuid.v4()
  return await todoAccess.createTodo({
    userId,
    todoId,
    createdAt,
    name,
    dueDate,
    done: false
  })
}

export const updateTodo = async (
  { name, dueDate, done }: UpdateTodoRequest,
  userId: string,
  todoId: string
): Promise<TodoItem> => {
  return await todoAccess.updateTodo({
    userId,
    todoId,
    name,
    dueDate,
    done
  })
}

export const updateTodoUrl = async (
  updateTodo,
  userId: string,
  todoId: string
): Promise<TodoItem> => {
  return await todoAccess.updateTodoUrl({
    userId,
    todoId,
    attachmentUrl: updateTodo.attachmentUrl
  })
}

export const removeTodo = async (userId: string, todoId: string) => {
  return await todoAccess.removeTodo(userId, todoId)
}
