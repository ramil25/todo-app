'use client';

import { useState } from 'react';
import { Check, Trash2, Edit2, X, Save, Calendar, Clock } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { Todo, UpdateTodo } from '@/lib/database';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, updates: UpdateTodo) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editDueDate, setEditDueDate] = useState(todo.due_date || '');

  const handleToggleComplete = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditDueDate(todo.due_date || '');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditDueDate(todo.due_date || '');
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      return;
    }

    onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      due_date: editDueDate || undefined,
    });

    setIsEditing(false);
  };

  const getDueDateDisplay = () => {
    if (!todo.due_date) {
      return null;
    }

    const dueDate = new Date(todo.due_date);
    
    let className = 'text-gray-700';
    let icon = Calendar;
    
    if (isPast(dueDate) && !todo.completed) {
      className = 'text-red-600';
      icon = Clock;
    } else if (isToday(dueDate)) {
      className = 'text-orange-600';
      icon = Clock;
    } else if (isTomorrow(dueDate)) {
      className = 'text-yellow-600';
      icon = Clock;
    }

    const IconComponent = icon;
    
    return (
      <div className={`flex items-center text-sm ${className}`}>
        <IconComponent className="w-4 h-4 mr-1" />
        {isToday(dueDate) && 'Due today'}
        {isTomorrow(dueDate) && 'Due tomorrow'}
        {!isToday(dueDate) && !isTomorrow(dueDate) && format(dueDate, 'MMM d, yyyy')}
        {isPast(dueDate) && !todo.completed && ' (Overdue)'}
      </div>
    );
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Todo title"
          />
          
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description (optional)"
            rows={2}
          />
          
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="flex space-x-2">
            <button
              onClick={handleSaveEdit}
              disabled={!editTitle.trim()}
              className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border transition-opacity ${
      todo.completed ? 'opacity-60' : ''
    }`}>
      <div className="flex items-start space-x-3">
        <button
          onClick={handleToggleComplete}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {todo.completed && <Check className="w-3 h-3" />}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-600' : 'text-gray-900'}`}>
            {todo.title}
          </h3>
          
          {todo.description && (
            <p className={`mt-1 text-sm ${todo.completed ? 'line-through text-gray-600' : 'text-gray-700'}`}>
              {todo.description}
            </p>
          )}
          
          <div className="mt-2">
            {getDueDateDisplay()}
          </div>
          
          <div className="mt-2 text-xs text-gray-600">
            Created {format(new Date(todo.created_at), 'MMM d, yyyy')}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="p-1 text-gray-600 hover:text-blue-600"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1 text-gray-600 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}