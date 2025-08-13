import { Todo, CreateTodo, UpdateTodo, localStorageDb } from './localStorage';

// Client-side API implementation using localStorage for static deployment
export async function fetchTodos(): Promise<Todo[]> {
  // Simulate async behavior
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(localStorageDb.getAllTodos());
    }, 100);
  });
}

export async function createTodo(todo: CreateTodo): Promise<Todo> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const newTodo = localStorageDb.createTodo(todo);
        resolve(newTodo);
      } catch {
        reject(new Error('Failed to create todo'));
      }
    }, 100);
  });
}

export async function updateTodo(id: number, updates: UpdateTodo): Promise<Todo> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const updatedTodo = localStorageDb.updateTodo(id, updates);
        if (!updatedTodo) {
          reject(new Error('Todo not found'));
          return;
        }
        resolve(updatedTodo);
      } catch {
        reject(new Error('Failed to update todo'));
      }
    }, 100);
  });
}

export async function deleteTodo(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const success = localStorageDb.deleteTodo(id);
        if (!success) {
          reject(new Error('Todo not found'));
          return;
        }
        resolve();
      } catch {
        reject(new Error('Failed to delete todo'));
      }
    }, 100);
  });
}

export async function fetchDueSoonTodos(): Promise<Todo[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(localStorageDb.getTodosDueSoon());
    }, 100);
  });
}