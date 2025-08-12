import { NextResponse } from 'next/server';
import { todoDb } from '@/lib/database';

export async function GET() {
  try {
    const dueSoonTodos = todoDb.getTodosDueSoon();
    return NextResponse.json(dueSoonTodos);
  } catch (error) {
    console.error('Error fetching due soon todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch due soon todos' },
      { status: 500 }
    );
  }
}