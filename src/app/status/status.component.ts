import { Component, input } from '@angular/core';
import { Status } from '../model/task.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-status',
  imports: [CommonModule, MatIconModule],
  templateUrl: './status.component.html',
})
export class StatusComponent {
  public curStatus = input.required<Status>();
  public status = Status;
}
