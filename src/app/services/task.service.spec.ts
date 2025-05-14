import { TaskService } from './task.service';
import { AddTask, Status, Task } from '../model/task.model';
import { SearchTasksService } from './search-tasks.service';

describe('TaskService', () => {
  let service: TaskService;
  let searchService: jasmine.SpyObj<SearchTasksService>;

  const sampleTask: AddTask = {
    name: 'New Task',
    description: 'A new test task'
  };

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'tasks') return JSON.stringify([]);
      return null;
    });
    spyOn(localStorage, 'setItem').and.stub();

    searchService = jasmine.createSpyObj('SearchTasksService', ['searchTasks']);
    searchService.searchTasks.and.callFake((tasks: Task[], term: string) => tasks);

    service = new TaskService();
    (service as any).searchService = searchService;
  });

  function getTasks(): Task[] {
    return (service as any).tasks;
  }

  it('should return all tasks if no search term is set', (done) => {
    const initialTask = { ...sampleTask, id: '1', status: Status.TODO, createdAt: new Date() };
    (service as any).updateTasks([initialTask]);

    service.tasks$.subscribe((tasks) => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].name).toBe('New Task');
      done();
    });
  });

  it('should add a new task with generated id and default status', () => {
    service.addTask(sampleTask);

    const [task] = getTasks();
    expect(task.status).toBe(Status.TODO);
    expect(task.name).toBe(sampleTask.name);
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should update an existing task', () => {
    const task: Task = {
      ...sampleTask,
      id: '123',
      status: Status.TODO,
      createdAt: new Date()
    };

    (service as any).updateTasks([task]);

    const updatedTask = { ...task, name: 'Updated' };
    service.updateTask(updatedTask);

    const [updated] = getTasks();
    expect(updated.name).toBe('Updated');
  });

  it('should delete a task by id', () => {
    const task: Task = {
      ...sampleTask,
      id: '123',
      status: Status.TODO,
      createdAt: new Date()
    };

    (service as any).updateTasks([task]);
    service.deleteTask('123');

    expect(getTasks().length).toBe(0);
  });

  it('should update search term and trigger search', (done) => {
    const task: Task = {
      ...sampleTask,
      id: 'abc',
      status: Status.TODO,
      createdAt: new Date()
    };

    (service as any).updateTasks([task]);
    service.searchTasks('abc');

    service.tasks$.subscribe((tasks) => {
      expect(searchService.searchTasks).toHaveBeenCalledWith([task], 'abc');
      expect(tasks.length).toBe(1);
      done();
    });
  });
});
