import { CommonModule } from '@angular/common';
import { afterNextRender, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { OperatorService } from '../services/operator.service';
import { TowerService } from '../services/tower.service';
import { TransactionService } from '../services/transaction.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatDividerModule
  ],
  selector: 'app-transactions',
  template: `
    <div class="page-shell">
      <div class="page-header">
        <div>
          <h2>Transactions</h2>
          <p>Track all tower purchases and manage new buy requests.</p>
        </div>
      </div>

      <div class="section-grid">
        <mat-card class="summary-card">
          <mat-card-title>Total Transactions</mat-card-title>
          <mat-card-content>{{ transactions.length }}</mat-card-content>
        </mat-card>
        <mat-card class="summary-card">
          <mat-card-title>Available Towers for Purchase</mat-card-title>
          <mat-card-content>{{ saleTowers.length }}</mat-card-content>
        </mat-card>
      </div>

      <mat-card>
        <mat-card-title>Recent Purchases</mat-card-title>
        <mat-card-content>
          <table mat-table [dataSource]="transactions" class="mat-elevation-z2 transaction-table">
            <ng-container matColumnDef="tower">
              <th mat-header-cell *matHeaderCellDef> Tower </th>
              <td mat-cell *matCellDef="let item"> {{ item.tower?.towerCode || item.tower?.name }} </td>
            </ng-container>
            <ng-container matColumnDef="buyer">
              <th mat-header-cell *matHeaderCellDef> Buyer </th>
              <td mat-cell *matCellDef="let item"> {{ item.buyerOperator?.name }} </td>
            </ng-container>
            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef> Price </th>
              <td mat-cell *matCellDef="let item"> {{ item.agreedPrice | currency:'INR' }} </td>
            </ng-container>
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef> Date </th>
              <td mat-cell *matCellDef="let item"> {{ item.createdAt | date:'mediumDate' }} </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>Buy Tower</mat-card-title>
        <mat-card-content>
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Tower</mat-label>
              <mat-select [(ngModel)]="transactionForm.towerId" name="towerId">
                <mat-option *ngFor="let tower of saleTowers" [value]="tower.id">
                  {{ tower.towerCode }} — {{ tower.location }}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Buyer Operator</mat-label>
              <mat-select [(ngModel)]="transactionForm.buyerOperatorId" name="buyerOperatorId">
                <mat-option *ngFor="let operator of buyers" [value]="operator.id">{{ operator.name }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Agreed Price</mat-label>
              <input matInput type="number" [(ngModel)]="transactionForm.agreedPrice" name="agreedPrice" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="span-full">
              <mat-label>Notes</mat-label>
              <input matInput [(ngModel)]="transactionForm.notes" name="notes" />
            </mat-form-field>
          </div>
          <div class="form-actions">
            <button mat-raised-button color="primary" (click)="buyTower()">Purchase Tower</button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .page-shell {
        display: grid;
        gap: 22px;
        padding: 22px;
      }
      .page-header h2 {
        margin: 0;
        font-size: 2rem;
      }
      .page-header p {
        margin: 4px 0 0;
        color: rgba(255, 255, 255, 0.76);
      }
      .section-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 18px;
      }
      .summary-card {
        background: #111827;
        color: #ede9fe;
        min-height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .transaction-table {
        width: 100%;
        margin-top: 16px;
      }
      .form-grid {
        display: grid;
        gap: 18px;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        margin-top: 16px;
      }
      .span-full {
        grid-column: span 2;
      }
      .form-actions {
        margin-top: 18px;
      }
    `
  ]
})
export class TransactionsPage implements OnInit {
  transactions: any[] = [];
  saleTowers: any[] = [];
  buyers: any[] = [];
  displayedColumns = ['tower', 'buyer', 'price', 'date'];

  transactionForm: any = {
    towerId: null,
    buyerOperatorId: null,
    agreedPrice: 0,
    notes: ''
  };

  constructor(
    private readonly transactionService: TransactionService,
    private readonly towerService: TowerService,
    private readonly operatorService: OperatorService,
    private readonly snackBar: MatSnackBar,
    private readonly changeDetector: ChangeDetectorRef
  ) {
    // Defer one task beyond hydration's dev-mode verification pass.
    afterNextRender(() => setTimeout(() => this.loadData()));
  }

  ngOnInit(): void {}

  private loadData(): void {
    this.transactionService.getAll().subscribe((data) => {
      this.transactions = data || [];
      this.changeDetector.detectChanges();
    });
    this.towerService.getAvailableForSale().subscribe((data) => {
      this.saleTowers = data || [];
      this.changeDetector.detectChanges();
    });
    this.operatorService.getAllOperators().subscribe((data) => {
      this.buyers = data || [];
      this.changeDetector.detectChanges();
    });
  }

  public buyTower(): void {
    this.transactionService.buyTower(this.transactionForm).subscribe({
      next: () => {
        this.snackBar.open('Tower purchase recorded.', 'Close', { duration: 3000 });
        this.transactionForm = { towerId: null, buyerOperatorId: null, agreedPrice: 0, notes: '' };
        this.loadData();
      },
      error: () => this.snackBar.open('Unable to submit purchase.', 'Close', { duration: 3000 })
    });
  }
}
