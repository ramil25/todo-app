'use client';

import { useState, useEffect } from 'react';
import { Todo, CreateTodo, UpdateTodo } from '@/lib/database';
import { fetchTodos, createTodo, updateTodo, deleteTodo, fetchDueSoonTodos } from '@/lib/api';
import { TodoForm } from '@/components/TodoForm';
import { TodoItem } from '@/components/TodoItem';
import { NotificationPanel } from '@/components/NotificationPanel';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [dueSoonTodos, setDueSoonTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = async () => {
    try {
      setError(null);
      const [todosData, dueSoonData] = await Promise.all([
        fetchTodos(),
        fetchDueSoonTodos(),
      ]);
      setTodos(todosData);
      setDueSoonTodos(dueSoonData);
    } catch (err) {
      setError('Failed to load todos');
      console.error('Error loading todos:', err);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleCreateTodo = async (todoData: CreateTodo) => {
    try {
      setIsLoading(true);
      setError(null);
      await createTodo(todoData);
      await loadTodos();
    } catch (err) {
      setError('Failed to create todo');
      console.error('Error creating todo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTodo = async (id: number, updates: UpdateTodo) => {
    try {
      setError(null);
      await updateTodo(id, updates);
      await loadTodos();
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setError(null);
      await deleteTodo(id);
      await loadTodos();
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
    }
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const pendingTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo App</h1>
          <p className="text-gray-600">Manage your tasks with due date notifications</p>
        </header>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <NotificationPanel dueSoonTodos={dueSoonTodos} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TodoForm onSubmit={handleCreateTodo} isLoading={isLoading} />
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Pending Todos */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Pending Tasks ({pendingTodos.length})
                </h2>
                {pendingTodos.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No pending tasks. Add a new todo to get started!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pendingTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onUpdate={handleUpdateTodo}
                        onDelete={handleDeleteTodo}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Completed Todos */}
              {completedTodos.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Completed Tasks ({completedTodos.length})
                  </h2>
                  <div className="space-y-3">
                    {completedTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onUpdate={handleUpdateTodo}
                        onDelete={handleDeleteTodo}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
