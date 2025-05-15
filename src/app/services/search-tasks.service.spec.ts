import { SearchTasksService } from './search-tasks.service';
import { Task, Status } from '../model/task.model';

describe('SearchTasksService', () => {
  let service: SearchTasksService;

  const tasks: Task[] = [
    {
      id: '1',
      name: 'Write unit tests',
      description: 'Cover all cases with Jasmine',
      status: Status.TODO,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Fix bugs',
      description: 'Resolve reported issues',
      status: Status.IN_PROGRESS,
      createdAt: new Date('2024-01-02'),
    },
    {
      id: '3',
      name: 'Refactor code',
      description: 'Clean up components',
      status: Status.COMPLETED,
      createdAt: new Date('2024-01-03'),
    },
  ];

  beforeEach(() => {
    service = new SearchTasksService();
  });

  it('should return all tasks when search term is empty', () => {
    const result = service.searchTasks(tasks, '');
    expect(result.length).toBe(3);
  });

  it('should return matching tasks by name', () => {
    const result = service.searchTasks(tasks, 'write');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Write unit tests');
  });

  it('should return matching tasks by description', () => {
    const result = service.searchTasks(tasks, 'reported');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });

  it('should return matching tasks by status', () => {
    const result = service.searchTasks(tasks, 'completed');
    expect(result.length).toBe(1);
    expect(result[0].status).toBe(Status.COMPLETED);
  });

  it('should return multiple matches when applicable', () => {
    const result = service.searchTasks(tasks, 'code');
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('Refactor code');
  });

  it('should return no results for unmatched search', () => {
    const result = service.searchTasks(tasks, 'nonexistent');
    expect(result.length).toBe(0);
  });
});
