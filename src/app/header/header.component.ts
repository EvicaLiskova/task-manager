import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../services/task.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Task } from '../model/task.model';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, MatTooltipModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  public searchControl = new FormControl('');
  public isSearchActive = signal(false);

  private destroy$ = new Subject<void>();
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly taskService = inject(TaskService);

  public ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(searchTerm => {
        this.isSearchActive.set(!!searchTerm);
        this.taskService.searchTasks(searchTerm ?? '');
      });
  }

  public clearSearch(): void {
    this.searchControl.setValue('');
    this.taskService.searchTasks('');
  }

  public onAddTaskClick(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: {
        mode: 'create',
      },
    });

    dialogRef.afterClosed().subscribe((task: Task | undefined) => {
      if (!task) return;

      this.taskService.addTask({
        name: task.name,
        description: task.description,
      });

      this.snackBar.open('Task added successfully!', 'Close', {
        duration: 3000,
        verticalPosition: 'bottom',
      });
    });
  }
}
