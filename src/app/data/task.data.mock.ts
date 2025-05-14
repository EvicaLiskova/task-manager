import { Status, Task } from '../model/task.model';
import { v4 as uuid } from 'uuid';

export const MOCK_TASKS: Task[] = [
  {
    id: uuid(),
    name: 'Buy groceries',
    description: 'Pick up milk, bread, eggs, and fruits.',
    status: Status.TODO,
    createdAt: new Date('2025-05-10T09:00:00'),
  },
  {
    id: uuid(),
    name: 'Finish Angular report',
    description: 'Complete and submit the Angular performance report.',
    status: Status.IN_PROGRESS,
    createdAt: new Date('2025-05-11T14:30:00'),
  },
  {
    id: uuid(),
    name: 'Clean the kitchen',
    description: 'Wipe down counters and empty the dishwasher.',
    status: Status.COMPLETED,
    createdAt: new Date('2025-05-09T17:45:00'),
  },
  {
    id: uuid(),
    name: 'Read a book',
    description: 'Finish reading the current book.',
    status: Status.TODO,
    createdAt: new Date('2025-05-12T20:00:00'),
  },
  {
    id: uuid(),
    name: 'Exercise',
    description: 'Go for a run or do a workout.',
    status: Status.IN_PROGRESS,
    createdAt: new Date('2025-05-13T07:30:00'),
  },
];
