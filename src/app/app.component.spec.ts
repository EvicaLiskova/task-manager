import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TaskService } from './services/task.service';
import { of } from 'rxjs';
import { Task, Status } from './model/task.model';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  const mockTasks: Task[] = [
    {
      id: 't1',
      name: 'Write unit tests',
      description: 'Write tests for the app component',
      status: Status.TODO,
      createdAt: new Date(),
    },
    {
      id: 't2',
      name: 'Review PR',
      description: 'Check status updates',
      status: Status.IN_PROGRESS,
      createdAt: new Date(),
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: TaskService,
          useValue: {
            tasks$: of(mockTasks),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('should render the header component', () => {
    const header = fixture.debugElement.query(By.css('[data-test-id="app_header"]'));
    expect(header).toBeTruthy();
  });

  it('should render the task list container', () => {
    const list = fixture.debugElement.query(By.css('[data-test-id="app_tasks_list"]'));
    expect(list).toBeTruthy();
  });

  it('should render the correct number of tasks', () => {
    const taskItems = fixture.debugElement.queryAll(By.css('[data-test-id="app_task_list_task"]'));
    expect(taskItems.length).toBe(mockTasks.length);
  });
});
