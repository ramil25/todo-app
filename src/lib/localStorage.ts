// Client-side localStorage implementation for static deployment
export interface Todo {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTodo {
  title: string;
  description?: string;
  due_date?: string;
}

export interface UpdateTodo {
  title?: string;
  description?: string;
  due_date?: string;
  completed?: boolean;
}

const STORAGE_KEY = 'todo-app-data';

class LocalStorageDatabase {
  private getTodos(): Todo[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const todos = data ? JSON.parse(data) : [];
      
      // Initialize with sample data if empty
      if (todos.length === 0) {
        const sampleTodos = this.initializeSampleData();
        this.saveTodos(sampleTodos);
        return sampleTodos;
      }
      
      return todos;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  private initializeSampleData(): Todo[] {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return [
      {
        id: 1,
        title: "Welcome to Todo App!",
        description: "This is a sample todo item. You can edit, complete, or delete it.",
        due_date: tomorrow.toISOString().split('T')[0],
        completed: false,
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      },
      {
        id: 2,
        title: "Try adding a new todo",
        description: "Use the form on the left to create your own todo items with due dates.",
        completed: false,
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      },
      {
        id: 3,
        title: "Plan weekend activities",
        description: "Decide what to do this weekend - maybe visit a museum or go hiking!",
        due_date: nextWeek.toISOString().split('T')[0],
        completed: false,
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      }
    ];
  }

  private saveTodos(todos: Todo[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private getNextId(): number {
    const todos = this.getTodos();
    return todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
  }

  getAllTodos(): Todo[] {
    return this.getTodos().sort((a, b) => {
      // Sort by due_date first, then by created_at
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      if (a.due_date && !b.due_date) return -1;
      if (!a.due_date && b.due_date) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  getTodosDueSoon(): Todo[] {
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    return this.getTodos().filter(todo => 
      todo.due_date && 
      todo.due_date <= tomorrowStr && 
      !todo.completed
    ).sort((a, b) => 
      new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()
    );
  }

  createTodo(todoData: CreateTodo): Todo {
    const todos = this.getTodos();
    const now = new Date().toISOString();
    
    const newTodo: Todo = {
      id: this.getNextId(),
      title: todoData.title,
      description: todoData.description,
      due_date: todoData.due_date,
      completed: false,
      created_at: now,
      updated_at: now
    };

    todos.push(newTodo);
    this.saveTodos(todos);
    return newTodo;
  }

  updateTodo(id: number, updates: UpdateTodo): Todo | null {
    const todos = this.getTodos();
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) return null;

    const updatedTodo = {
      ...todos[todoIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    todos[todoIndex] = updatedTodo;
    this.saveTodos(todos);
    return updatedTodo;
  }

  deleteTodo(id: number): boolean {
    const todos = this.getTodos();
    const initialLength = todos.length;
    const filteredTodos = todos.filter(t => t.id !== id);
    
    if (filteredTodos.length < initialLength) {
      this.saveTodos(filteredTodos);
      return true;
    }
    return false;
  }

  getTodoById(id: number): Todo | null {
    const todos = this.getTodos();
    return todos.find(t => t.id === id) || null;
  }
}

export const localStorageDb = new LocalStorageDatabase();