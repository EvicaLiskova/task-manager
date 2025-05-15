import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AddTask } from '../model/task.model';
import { TaskDialogData } from '../model/task-dialog.model';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  templateUrl: './task-dialog.component.html',
  imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class TaskDialogComponent {
  public readonly data: TaskDialogData = inject(MAT_DIALOG_DATA);
  public readonly dialogRef: MatDialogRef<TaskDialogComponent> = inject(MatDialogRef);

  public task: AddTask = {
    name: '',
    description: '',
    ...this.data.task,
  };

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onSave(): void {
    this.dialogRef.close(this.task);
  }
}
