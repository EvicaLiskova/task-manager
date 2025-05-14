import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusSwitcherComponent } from './status-switcher.component';
import { Status } from '../model/task.model';
import { By } from '@angular/platform-browser';

const TEST_ID_MOVE_TO_PROGRESS = '[data-test-id="status-switcher_to-progreee"]';
const TEST_ID_MARK_COMPLETED = '[data-test-id="status-switcher_to-completed"]';

describe('StatusSwitcherComponent', () => {
  let fixture: ComponentFixture<StatusSwitcherComponent>;
  let component: StatusSwitcherComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusSwitcherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusSwitcherComponent);
    component = fixture.componentInstance;
  });

  it('should show "Move to In Progress" button if status is TODO', () => {
    fixture.componentRef.setInput('curStatus', Status.TODO);
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css(TEST_ID_MOVE_TO_PROGRESS));
    expect(btn).toBeTruthy();
    expect(btn.nativeElement.textContent).toContain('Move to In Progress');
  });

  it('should show "Mark Completed" button if status is IN_PROGRESS', () => {
    fixture.componentRef.setInput('curStatus', Status.IN_PROGRESS);
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css(TEST_ID_MARK_COMPLETED));
    expect(btn).toBeTruthy();
    expect(btn.nativeElement.textContent).toContain('Mark Completed');
  });

  it('should emit IN_PROGRESS when "Move to In Progress" is clicked', () => {
    fixture.componentRef.setInput('curStatus', Status.TODO);
    fixture.detectChanges();

    spyOn(component.statusChange, 'emit');

    const btn = fixture.debugElement.query(By.css(TEST_ID_MOVE_TO_PROGRESS)).nativeElement;
    btn.click();

    expect(component.statusChange.emit).toHaveBeenCalledWith(Status.IN_PROGRESS);
  });

  it('should emit COMPLETED when "Mark Completed" is clicked', () => {
    fixture.componentRef.setInput('curStatus', Status.IN_PROGRESS);
    fixture.detectChanges();

    spyOn(component.statusChange, 'emit');

    const btn = fixture.debugElement.query(By.css(TEST_ID_MARK_COMPLETED)).nativeElement;
    btn.click();

    expect(component.statusChange.emit).toHaveBeenCalledWith(Status.COMPLETED);
  });

  it('should render nothing when status is COMPLETED', () => {
    fixture.componentRef.setInput('curStatus', Status.COMPLETED);
    fixture.detectChanges();

    const progressBtn = fixture.debugElement.query(By.css(TEST_ID_MOVE_TO_PROGRESS));
    const completedBtn = fixture.debugElement.query(By.css(TEST_ID_MARK_COMPLETED));

    expect(progressBtn).toBeNull();
    expect(completedBtn).toBeNull();
  });
});
