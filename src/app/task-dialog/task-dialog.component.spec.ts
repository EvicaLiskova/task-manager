import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDialogComponent } from './task-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskDialogData } from '../model/task-dialog.model';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('TaskDialogComponent', () => {
  let fixture: ComponentFixture<TaskDialogComponent>;
  let component: TaskDialogComponent;

  const dialogCloseSpy = jasmine.createSpy('close');

  const defaultData: TaskDialogData = {
    mode: 'create',
    task: undefined,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskDialogComponent, FormsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: dialogCloseSpy } },
        { provide: MAT_DIALOG_DATA, useValue: defaultData },
      ],
    });

    fixture = TestBed.createComponent(TaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show "Add New Task" in create mode', () => {
    const title = fixture.debugElement.query(By.css('[data-test-id="task-dialog_header"]'));
    expect(title.nativeElement.textContent).toContain('Add New Task');
  });

  it('should disable the action button until a name is typed', () => {
    const button: HTMLButtonElement = fixture.debugElement.query(By.css('[data-test-id="task-dialog_button_action"]')).nativeElement;
    expect(button.disabled).toBeTrue();

    const input: HTMLInputElement = fixture.debugElement.query(By.css('[data-test-id="task-dialog_input_name"]')).nativeElement;
    input.value = 'My Task';
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    expect(button.disabled).toBeFalse();
  });

  it('should capture input values and close with task on save', async () => {
    const nameInput: HTMLInputElement = fixture.debugElement.query(By.css('[data-test-id="task-dialog_input_name"]')).nativeElement;
    const descriptionInput: HTMLTextAreaElement = fixture.debugElement.query(By.css('[data-test-id="task-dialog_input_description"]')).nativeElement;

    nameInput.value = 'My New Task';
    nameInput.dispatchEvent(new Event('input'));

    descriptionInput.value = 'Details go here';
    descriptionInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.debugElement.query(By.css('[data-test-id="task-dialog_button_action"]')).nativeElement;
    button.click();

    expect(dialogCloseSpy).toHaveBeenCalledWith({
      name: 'My New Task',
      description: 'Details go here',
    });
  });

  it('should close the dialog on cancel', () => {
    const cancelButton = fixture.debugElement.query(By.css('[data-test-id="task-dialog_button_cancel"]')).nativeElement;
    cancelButton.click();
    expect(dialogCloseSpy).toHaveBeenCalled();
  });
});
