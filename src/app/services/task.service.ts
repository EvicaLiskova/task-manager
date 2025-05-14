import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { MOCK_TASKS } from '../data/task.data.mock';
import { AddTask, Status, Task } from '../model/task.model';
import { v4 as uuidv4 } from 'uuid';
import { SearchTasksService } from './search-tasks.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private static readonly STORAGE_KEY = 'tasks';
  private readonly searchService: SearchTasksService = new SearchTasksService();
  private readonly searchTerm$ = new BehaviorSubject<string>('');
  private baseTasks$ = new BehaviorSubject<Task[]>(this.loadTasks());
  private filteredTasks$ = combineLatest([this.baseTasks$, this.searchTerm$]).pipe(
    map(([tasks, searchTerm]) => this.searchService.searchTasks(tasks, searchTerm))
  );

  private get tasks(): Task[] {
    return this.baseTasks$.getValue();
  }

  public get tasks$(): Observable<Task[]> {
    return this.filteredTasks$;
  }

  public addTask(task: AddTask): void {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      status: Status.TODO,
      createdAt: new Date(),
    };

    const updated = [...this.tasks, newTask];

    this.updateTasks(updated);
  }

  public updateTask(updateTask: Task): void {
    const updated = this.tasks.map(task => (task.id === updateTask.id ? { ...updateTask } : task));
    this.updateTasks(updated);
  }

  public deleteTask(id: string): void {
    const updated = this.tasks.filter(task => task.id !== id);
    this.updateTasks(updated);
  }

  public searchTasks(searchTerm: string): void {
    this.searchTerm$.next(searchTerm);
  }

  private updateTasks(tasks: Task[]): void {
    this.baseTasks$.next(tasks);
    this.saveTasks(tasks);
  }

  private loadTasks(): Task[] {
    const stored = localStorage.getItem(TaskService.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [...MOCK_TASKS];
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(TaskService.STORAGE_KEY, JSON.stringify(tasks));
  }
}
