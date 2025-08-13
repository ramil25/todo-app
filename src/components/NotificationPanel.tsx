'use client';

import { Bell, Clock } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { Todo } from '@/lib/localStorage';

interface NotificationPanelProps {
  dueSoonTodos: Todo[];
}

export function NotificationPanel({ dueSoonTodos }: NotificationPanelProps) {
  if (dueSoonTodos.length === 0) {
    return null;
  }

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    if (isToday(date)) {
      return 'Due today';
    } else if (isTomorrow(date)) {
      return 'Due tomorrow';
    } else {
      return `Due ${format(date, 'MMM d')}`;
    }
  };

  return (
    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg mb-6">
      <div className="flex items-center mb-3">
        <Bell className="w-5 h-5 text-orange-600 mr-2" />
        <h3 className="text-lg font-medium text-orange-800">
          Upcoming Due Dates
        </h3>
      </div>
      
      <div className="space-y-2">
        {dueSoonTodos.map((todo) => (
          <div key={todo.id} className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="font-medium text-orange-800">{todo.title}</span>
            <span className="text-orange-600">
              · {formatDueDate(todo.due_date!)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}