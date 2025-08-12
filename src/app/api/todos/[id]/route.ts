import { NextRequest, NextResponse } from 'next/server';
import { todoDb } from '@/lib/database';

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const todoId = parseInt(id);

    if (isNaN(todoId)) {
      return NextResponse.json(
        { error: 'Invalid todo ID' },
        { status: 400 }
      );
    }

    const todo = todoDb.getTodoById(todoId);

    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todo' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const todoId = parseInt(id);

    if (isNaN(todoId)) {
      return NextResponse.json(
        { error: 'Invalid todo ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updatedTodo = todoDb.updateTodo(todoId, body);

    if (!updatedTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const todoId = parseInt(id);

    if (isNaN(todoId)) {
      return NextResponse.json(
        { error: 'Invalid todo ID' },
        { status: 400 }
      );
    }

    const success = todoDb.deleteTodo(todoId);

    if (!success) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}