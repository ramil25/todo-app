import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'todos.db');

// Ensure the data directory exists
import { existsSync, mkdirSync } from 'fs';
const dataDir = path.join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON');

// Create todos table
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    completed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create an index on due_date for better query performance
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date)
`);

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

export class TodoDatabase {
  private db: Database.Database;

  constructor() {
    this.db = db;
  }

  // Get all todos
  getAllTodos(): Todo[] {
    const stmt = this.db.prepare(`
      SELECT * FROM todos 
      ORDER BY due_date ASC, created_at DESC
    `);
    return stmt.all() as Todo[];
  }

  // Get todos due soon (within next 24 hours)
  getTodosDueSoon(): Todo[] {
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const stmt = this.db.prepare(`
      SELECT * FROM todos 
      WHERE due_date <= ? AND completed = FALSE
      ORDER BY due_date ASC
    `);
    return stmt.all(tomorrowStr) as Todo[];
  }

  // Create a new todo
  createTodo(todo: CreateTodo): Todo {
    const stmt = this.db.prepare(`
      INSERT INTO todos (title, description, due_date)
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(todo.title, todo.description, todo.due_date);
    
    const selectStmt = this.db.prepare('SELECT * FROM todos WHERE id = ?');
    return selectStmt.get(result.lastInsertRowid) as Todo;
  }

  // Update a todo
  updateTodo(id: number, updates: UpdateTodo): Todo | null {
    const setParts: string[] = [];
    const values: (string | number)[] = [];

    if (updates.title !== undefined) {
      setParts.push('title = ?');
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      setParts.push('description = ?');
      values.push(updates.description);
    }
    if (updates.due_date !== undefined) {
      setParts.push('due_date = ?');
      values.push(updates.due_date);
    }
    if (updates.completed !== undefined) {
      setParts.push('completed = ?');
      values.push(updates.completed ? 1 : 0);
    }

    if (setParts.length === 0) {
      return null;
    }

    setParts.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE todos 
      SET ${setParts.join(', ')}
      WHERE id = ?
    `);
    
    const result = stmt.run(...values);
    
    if (result.changes === 0) {
      return null;
    }

    const selectStmt = this.db.prepare('SELECT * FROM todos WHERE id = ?');
    return selectStmt.get(id) as Todo;
  }

  // Delete a todo
  deleteTodo(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM todos WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Get a single todo by ID
  getTodoById(id: number): Todo | null {
    const stmt = this.db.prepare('SELECT * FROM todos WHERE id = ?');
    return (stmt.get(id) as Todo) || null;
  }
}

export const todoDb = new TodoDatabase();