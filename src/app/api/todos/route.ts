import { NextRequest, NextResponse } from 'next/server';
import { todoDb } from '@/lib/database';

export async function GET() {
  try {
    const todos = todoDb.getAllTodos();
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, due_date } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const todo = todoDb.createTodo({
      title,
      description,
      due_date,
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}