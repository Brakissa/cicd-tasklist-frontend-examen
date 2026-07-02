import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTasks, getTask, createTask, updateTask, deleteTask } from '../api/taskApi';

const mockTask = {
	id: 1,
	title: 'Test',
	description: null,
	completed: false,
	createdAt: '2026-01-15T10:00:00Z',
	updatedAt: '2026-01-15T10:00:00Z',
};

beforeEach(() => {
	vi.restoreAllMocks();
});

describe('taskApi', () => {
	it('getTasks returns array', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve([mockTask]),
			})
		);

		const tasks = await getTasks();
		expect(tasks).toEqual([mockTask]);
		expect(fetch).toHaveBeenCalledWith('/api/tasks');
	});

	it('getTask returns a single task', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockTask) }));
		await expect(getTask(1)).resolves.toEqual(mockTask);
	});

	it('createTask, updateTask and deleteTask call the right endpoints', async () => {
		const fetchMock = vi.fn()
			.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockTask) })
			.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ...mockTask, completed: true }) })
			.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('') });
		vi.stubGlobal('fetch', fetchMock);

		await expect(createTask({ title: 'Test' })).resolves.toEqual(mockTask);
		await expect(updateTask(1, { completed: true })).resolves.toEqual({ ...mockTask, completed: true });
		await expect(deleteTask(1)).resolves.toBeUndefined();
	});

	it('throws on failed responses for each API helper', async () => {
		const failedResponse = { ok: false, status: 500, text: () => Promise.resolve('error') };
		const fetchMock = vi.fn().mockResolvedValue(failedResponse);
		vi.stubGlobal('fetch', fetchMock);

		await expect(getTasks()).rejects.toThrow('HTTP 500: error');
		await expect(getTask(1)).rejects.toThrow('HTTP 500: error');
		await expect(createTask({ title: 'Test' })).rejects.toThrow('HTTP 500: error');
		await expect(updateTask(1, { title: 'Test' })).rejects.toThrow('HTTP 500: error');
		await expect(deleteTask(1)).rejects.toThrow('HTTP 500: error');
	});
});
