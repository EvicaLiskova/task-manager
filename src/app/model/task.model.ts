export enum Status {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export type Task = {
  id: string;
  name: string;
  description: string;
  status: Status;
  createdAt: Date;
};

export type AddTask = Omit<Task, 'id' | 'status' | 'createdAt'>;