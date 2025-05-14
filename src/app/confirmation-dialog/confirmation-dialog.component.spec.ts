import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

const TEST_ID_HEADER = '[data-test-id="confirmation-dialog_header"]';
const TEST_ID_QUESTION = '[data-test-id="confirmation-dialog_question"]';
const TEST_ID_TASK_NAME = '[data-test-id="confirmation-dialog_task-name"]';
const TEST_ID_WARNING = '[data-test-id="confirmation-dialog_warning"]';
const TEST_ID_BUTTON_YES = '[data-test-id="confirmation-dialog_button_yes"]';
const TEST_ID_BUTTON_NO = '[data-test-id="confirmation-dialog_button_no"]';

describe('ConfirmationDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let component: ConfirmationDialogComponent;

  const mockDialogRef = jasmine.createSpyObj('MatDialogRef<ConfirmationDialogComponent>', ['close']);
  const taskName = 'Sample Task';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: taskName }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the correct title and text content', () => {
    expect(fixture.debugElement.query(By.css(TEST_ID_HEADER)).nativeElement.textContent).toContain('Confirm Task Deletion');
    expect(fixture.debugElement.query(By.css(TEST_ID_QUESTION)).nativeElement.textContent).toContain('Are you sure you want to delete this task');
    expect(fixture.debugElement.query(By.css(TEST_ID_TASK_NAME)).nativeElement.textContent).toContain(taskName);
    expect(fixture.debugElement.query(By.css(TEST_ID_WARNING)).nativeElement.textContent).toContain('This action cannot be undone');
  });

  it('should close the dialog with true when "Yes" is clicked', () => {
    fixture.debugElement.query(By.css(TEST_ID_BUTTON_YES)).nativeElement.click();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close the dialog with false when "No" is clicked', () => {
    fixture.debugElement.query(By.css(TEST_ID_BUTTON_NO)).nativeElement.click();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });
});
