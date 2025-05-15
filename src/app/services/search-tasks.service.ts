import Fuse from 'fuse.js';
import { Task } from '../model/task.model';

export class SearchTasksService {
  private fuse: Fuse<Task> = new Fuse([], {
    keys: ['name', 'status', 'description'],
    threshold: 0.3,
    ignoreLocation: true,
    useExtendedSearch: true,
  });

  public searchTasks(tasks: Task[], searchTerm: string): Task[] {
    if (!searchTerm) {
      return tasks;
    }

    this.fuse.setCollection(tasks);
    const results = this.fuse.search(searchTerm);

    return results.map(result => result.item);
  }
}
