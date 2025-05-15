import { Component, computed, inject, input } from '@angular/core';
import { Status, Task } from '../model/task.model';
import { StatusComponent } from '../status/status.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgClass } from '@angular/common';
import { TaskService } from '../services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { StatusSwitcherComponent } from '../status-switcher/status-switcher.component';

@Component({
  selector: 'app-task',
  imports: [
    NgClass,
    StatusComponent,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatTooltipModule,
    StatusSwitcherComponent,
  ],
  templateUrl: './task.component.html',
})
export class TaskComponent {
  public task = input.required<Task>();
  public status = Status;

  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  public borderColorClass = computed(() => ({
    'border-gray-300': this.task().status === Status.TODO,
    'border-blue-300': this.task().status === Status.IN_PROGRESS,
    'border-green-300': this.task().status === Status.COMPLETED,
  }));

  public onEditTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: {
        mode: 'edit',
        task: this.task(),
      },
    });

    dialogRef.afterClosed().subscribe((task: Task | undefined) => {
      if (task) {
        this.taskService.updateTask(task);
        this.snackBar.open('Task updated!', 'Close', { duration: 3000 });
      }
    });
  }

  public onDeleteTask(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: this.task().name,
    });

    dialogRef.afterClosed().subscribe((confirmation: boolean) => {
      if (confirmation) {
        this.taskService.deleteTask(this.task().id);
        this.snackBar.open('Task deleted!', 'Close', { duration: 3000 });
      }
    });
  }

  public onUpdateTaskStatus(newStatus: Status): void {
    this.taskService.updateTask({ ...this.task(), status: newStatus });
    this.snackBar.open('Task status updated!', 'Close', { duration: 3000 });
  }
}
