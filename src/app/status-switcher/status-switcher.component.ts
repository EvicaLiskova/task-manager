import { Component, input, output } from '@angular/core';
import { Status } from '../model/task.model';

@Component({
  selector: 'app-status-switcher',
  imports: [],
  templateUrl: './status-switcher.component.html',
  styleUrl: './status-switcher.component.scss'
})
export class StatusSwitcherComponent {
  public curStatus = input.required<Status>()
  public statusChange = output<Status>();
  public status = Status;
  
  public moveTo(status: Status): void {
    this.statusChange.emit(status);
  }
}
