import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskComponent } from './task.component';
import { Task, Status } from '../model/task.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TaskService } from '../services/task.service';

describe('TaskComponent', () => {
  let fixture: ComponentFixture<TaskComponent>;
  let component: TaskComponent;

  let updateTaskSpy: jasmine.Spy;
  let deleteTaskSpy: jasmine.Spy;
  let snackBarSpy: jasmine.Spy;
  let dialogMock: jasmine.SpyObj<MatDialog>;

  const mockTask: Task = {
    id: 't123',
    name: 'Write Tests',
    description: 'Write unit tests for the task component',
    status: Status.TODO,
    createdAt: new Date('2024-01-01T12:00:00Z'),
  };

  beforeEach(async () => {
    updateTaskSpy = jasmine.createSpy('updateTask');
    deleteTaskSpy = jasmine.createSpy('deleteTask');
    snackBarSpy = jasmine.createSpy('open');
    dialogMock = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [TaskComponent],
      providers: [
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatSnackBar, useValue: { open: snackBarSpy } },
        {
          provide: TaskService,
          useValue: {
            updateTask: updateTaskSpy,
            deleteTask: deleteTaskSpy,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();
  });

  it('should render task name and description', () => {
    const name = fixture.debugElement.query(By.css('[data-test-id="task_name"]')).nativeElement;
    const desc = fixture.debugElement.query(By.css('[data-test-id="task_description"]')).nativeElement;
    expect(name.textContent).toContain(mockTask.name);
    expect(desc.textContent).toContain(mockTask.description);
  });

  it('should render formatted date', () => {
    const date = fixture.debugElement.query(By.css('[data-test-id="task_date"]')).nativeElement;
    expect(date.textContent).toContain('2024');
  });

  it('should call updateTask when edit dialog returns a task', () => {
    const updated = { ...mockTask, name: 'Updated Task' };
    dialogMock.open.and.returnValue({ afterClosed: () => of(updated) } as unknown as MatDialogRef<unknown>);

    const btn = fixture.debugElement.query(By.css('[data-test-id="task_button_edit"]')).nativeElement;
    btn.click();
    fixture.detectChanges();

    expect(updateTaskSpy).toHaveBeenCalled();
    const taskArg = updateTaskSpy.calls.mostRecent().args[0];
    expect(taskArg.name).toBe('Updated Task');
  });

  it('should call deleteTask when delete dialog returns true', () => {
    dialogMock.open.and.returnValue({ afterClosed: () => of(true) } as unknown as MatDialogRef<unknown>);

    const btn = fixture.debugElement.query(By.css('[data-test-id="task_button_delete"]')).nativeElement;
    btn.click();
    fixture.detectChanges();

    expect(deleteTaskSpy).toHaveBeenCalledWith(mockTask.id);
    expect(snackBarSpy).toHaveBeenCalledWith('Task deleted!', 'Close', { duration: 3000 });
  });

  it('should call updateTask when status is changed', () => {
    component.onUpdateTaskStatus(Status.IN_PROGRESS);
    fixture.detectChanges();

    expect(updateTaskSpy).toHaveBeenCalled();
    const taskArg = updateTaskSpy.calls.mostRecent().args[0];
    expect(taskArg.status).toBe(Status.IN_PROGRESS);
  });
});
