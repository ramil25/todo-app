import { Todo, CreateTodo, UpdateTodo } from './database';

const API_BASE = '/api/todos';

export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
}

export async function createTodo(todo: CreateTodo): Promise<Todo> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create todo');
  }
  
  return response.json();
}

export async function updateTodo(id: number, updates: UpdateTodo): Promise<Todo> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update todo');
  }
  
  return response.json();
}

export async function deleteTodo(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
}

export async function fetchDueSoonTodos(): Promise<Todo[]> {
  const response = await fetch(`${API_BASE}/due-soon`);
  if (!response.ok) {
    throw new Error('Failed to fetch due soon todos');
  }
  return response.json();
}