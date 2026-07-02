import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { TaskItem } from '../components/TaskItem';
import type { Task } from '../types/task';

const task: Task = {
  id: 1,
  title: 'Tâche test',
  description: 'Description test',
  completed: false,
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-01-15T10:00:00Z',
};

describe('TaskItem', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('toggles, edits and deletes a task', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();

    render(<TaskItem task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);

    fireEvent.click(screen.getByLabelText(/Marquer/));
    expect(onToggle).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByLabelText('Modifier'));
    const titleInput = screen.getByLabelText('Modifier le titre');
    const descriptionInput = screen.getByLabelText('Modifier la description');
    fireEvent.change(titleInput, { target: { value: '  Tâche modifiée  ' } });
    fireEvent.change(descriptionInput, { target: { value: '  Desc modifiée  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));

    expect(onEdit).toHaveBeenCalledWith(1, {
      title: 'Tâche modifiée',
      description: 'Desc modifiée',
    });

    fireEvent.click(screen.getByLabelText('Supprimer'));
    fireEvent.click(screen.getByLabelText('Supprimer'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('prevents empty edit save and cancels editing', () => {
    const onEdit = vi.fn();
    render(<TaskItem task={task} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={onEdit} />);

    fireEvent.click(screen.getByLabelText('Modifier'));
    fireEvent.change(screen.getByLabelText('Modifier le titre'), { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
    expect(onEdit).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));
    expect(screen.getByText('Tâche test')).toBeInTheDocument();
  });
});
