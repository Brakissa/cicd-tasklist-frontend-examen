import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TaskForm } from '../components/TaskForm';

describe('TaskForm', () => {
  it('submits a trimmed task and resets the form in create mode', () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Titre'), {
      target: { value: '  Titre de test  ' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: '  Description test  ' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Titre de test',
      description: 'Description test',
    });
    expect(screen.getByLabelText('Titre')).toHaveValue('');
    expect(screen.getByLabelText('Description')).toHaveValue('');
  });

  it('shows a validation error when title is empty', () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Description uniquement' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Le titre est requis');
    expect(screen.getByLabelText('Titre')).toHaveClass('input-error');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('supports edit mode and cancel action', () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    render(
      <TaskForm
        mode="edit"
        onSubmit={onSubmit}
        onCancel={onCancel}
        initialValues={{ title: 'Titre existant', description: 'Desc existante' }}
      />
    );

    expect(screen.getByRole('heading', { name: 'Modifier la tâche' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Modifier' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
