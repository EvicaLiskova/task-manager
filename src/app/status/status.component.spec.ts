import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusComponent } from './status.component';
import { Status } from '../model/task.model';
import { By } from '@angular/platform-browser';

describe('StatusComponent', () => {
  let fixture: ComponentFixture<StatusComponent>;
  let component: StatusComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusComponent);
    component = fixture.componentInstance;
  });

  function detectWithStatus(status: Status) {
    fixture.componentRef.setInput('curStatus', status);
    fixture.detectChanges();
  }

  it('should render TODO status correctly', () => {
    detectWithStatus(Status.TODO);
    const el = fixture.debugElement.query(By.css('[data-test-id="status_todo"]'));
    expect(el).toBeTruthy();
    expect(el.nativeElement.textContent).toContain('Todo');
    expect(el.nativeElement.textContent).toContain('not_started');
  });

  it('should render IN_PROGRESS status correctly', () => {
    detectWithStatus(Status.IN_PROGRESS);
    const el = fixture.debugElement.query(By.css('[data-test-id="status_in_progress"]'));
    expect(el).toBeTruthy();
    expect(el.nativeElement.textContent).toContain('In Progress');
    expect(el.nativeElement.textContent).toContain('pending');
  });

  it('should render COMPLETED status correctly', () => {
    detectWithStatus(Status.COMPLETED);
    const el = fixture.debugElement.query(By.css('[data-test-id="status_completed"]'));
    expect(el).toBeTruthy();
    expect(el.nativeElement.textContent).toContain('Complete');
    expect(el.nativeElement.textContent).toContain('check_circle');
  });

  it('should not render other statuses', () => {
    detectWithStatus(Status.IN_PROGRESS);

    expect(fixture.debugElement.query(By.css('[data-test-id="status_todo"]'))).toBeNull();
    expect(fixture.debugElement.query(By.css('[data-test-id="status_completed"]'))).toBeNull();
  });
});
