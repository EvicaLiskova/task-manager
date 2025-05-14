import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../services/task.service';
import { Task } from '../model/task.model';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

const TEST_ID_SEARCH_INPUT = '[data-test-id="header_search-input"]';
const TEST_ID_SEARCH_CLEAR = '[data-test-id="header_search-clear"]';
const TEST_ID_ADD_TASK_BUTTON = '[data-test-id="header_button_add-task"]';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;

  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['addTask', 'searchTasks']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: TaskService, useValue: taskServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should debounce and trigger search on input change', fakeAsync(() => {
    const input = fixture.debugElement.query(By.css(TEST_ID_SEARCH_INPUT)).nativeElement;
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    tick(1000);

    expect(taskServiceSpy.searchTasks).toHaveBeenCalledWith('test');
  }));

  it('should clear the search when clear button is clicked', fakeAsync(() => {
    component.searchControl.setValue('something');
    
    fixture.detectChanges();
    tick(2000);
    fixture.detectChanges();

    const clearBtn = fixture.debugElement.query(By.css(TEST_ID_SEARCH_CLEAR)).nativeElement;
    clearBtn.click();
    fixture.detectChanges();

    expect(component.searchControl.value).toBe('');
    expect(taskServiceSpy.searchTasks).toHaveBeenCalledWith('');
  }));

  it('should open dialog and add task on confirm', () => {
    const newTask: Task = {
      id: '1',
      name: 'Test Task',
      description: 'Test Description',
      status: undefined as any,
      createdAt: new Date(),
    };

    dialogSpy.open.and.returnValue({ afterClosed: () => of(newTask) } as any);

    const btn = fixture.debugElement.query(By.css(TEST_ID_ADD_TASK_BUTTON)).nativeElement;
    btn.click();

    expect(taskServiceSpy.addTask).toHaveBeenCalledWith({
      name: newTask.name,
      description: newTask.description,
    });

    expect(snackBarSpy.open).toHaveBeenCalledWith('Task added successfully!', 'Close', {
      duration: 3000,
      verticalPosition: 'bottom',
    });
  });

  it('should not call addTask if dialog returns undefined', () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(undefined) } as any);

    const btn = fixture.debugElement.query(By.css(TEST_ID_ADD_TASK_BUTTON)).nativeElement;
    btn.click();

    expect(taskServiceSpy.addTask).not.toHaveBeenCalled();
  });
});
