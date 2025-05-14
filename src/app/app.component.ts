import { Component, inject, Signal, signal } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { TaskComponent } from './task/task.component';
import { HeaderComponent } from './header/header.component';
import { TaskService } from './services/task.service';
import { Task } from './model/task.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public tasks = signal<Task[]>([]);
  
  private taskService = inject(TaskService);
  private matIconReg = inject(MatIconRegistry);

  ngOnInit(): void {
    this.matIconReg.setDefaultFontSetClass('material-symbols-outlined');

    this.taskService.tasks$.subscribe(tasks => {
      this.tasks.set(tasks);
    });
  }
}
