import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTasks } from '../hooks/useTasks';
import * as taskApi from '../api/taskApi';

describe('useTasks', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('loads tasks and exposes CRUD actions', async () => {
    const tasks = [{
      id: 1,
      title: 'A',
      description: null,
      completed: false,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    }];

    vi.spyOn(taskApi, 'getTasks').mockResolvedValue(tasks);
    vi.spyOn(taskApi, 'createTask').mockResolvedValue({ ...tasks[0], title: 'B' });
    vi.spyOn(taskApi, 'updateTask').mockResolvedValue({ ...tasks[0], completed: true });
    vi.spyOn(taskApi, 'deleteTask').mockResolvedValue(undefined);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tasks).toEqual(tasks);

    await result.current.addTask({ title: 'B' });
    await waitFor(() => expect(result.current.tasks[0].title).toBe('B'));

    await result.current.toggleComplete(1);
    await waitFor(() => expect(result.current.tasks[0].completed).toBe(true));

    await result.current.editTask(1, { title: 'Edited' });
    await result.current.removeTask(1);
    await waitFor(() => expect(result.current.tasks).toEqual([]));
  });

  it('handles load errors', async () => {
    vi.spyOn(taskApi, 'getTasks').mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useTasks());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('boom');
  });
});
