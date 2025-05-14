import { Task } from './task.model';

export type TaskDialogMode = 'create' | 'edit';

export type TaskDialogData = {
  mode: TaskDialogMode;
  task?: Task;
};
