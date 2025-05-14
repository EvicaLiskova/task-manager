import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  public readonly taskName: string = inject(MAT_DIALOG_DATA);
  public readonly dialogRef: MatDialogRef<ConfirmationDialogComponent> = inject(MatDialogRef);
  
  public onConfirm(confirmation: boolean): void {
    this.dialogRef.close(confirmation);
  }
}
