import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
          <h2>Tower Sale & Purchase Ledger</h2>
          <p>View buy/sell asset operations and buy available towers from other operators.</p>
        </div>
      </div>

      <mat-card>
        <mat-card-title>Completed Transactions</mat-card-title>
        <mat-card-content>
          <table mat-table [dataSource]="transactions" class="mat-elevation-z2 tx-table">
            <ng-container matColumnDef="tower">
              <th mat-header-cell *matHeaderCellDef> Tower </th>
              <td mat-cell *matCellDef="let tx"> {{ tx.tower?.towerCode || tx.tower?.name }} </td>
            </ng-container>
            <ng-container matColumnDef="seller">
              <th mat-header-cell *matHeaderCellDef> Seller </th>
              <td mat-cell *matCellDef="let tx"> {{ tx.sellerOperator?.name }} </td>
            </ng-container>
            <ng-container matColumnDef="buyer">
              <th mat-header-cell *matHeaderCellDef> Buyer </th>
              <td mat-cell *matCellDef="let tx"> {{ tx.buyerOperator?.name }} </td>
            </ng-container>
            <ng-container matColumnDef="agreedPrice">
              <th mat-header-cell *matHeaderCellDef> Agreed Price </th>
              <td mat-cell *matCellDef="let tx"> {{ tx.agreedPrice | currency:'INR':'symbol' }} </td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef> Status </th>
              <td mat-cell *matCellDef="let tx"> {{ tx.status }} </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>Buy a Tower Asset</mat-card-title>
        <mat-card-content>
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Tower Available for Sale</mat-label>
              <mat-select name="towerId" [(ngModel)]="transactionForm.towerId">
                <mat-option *ngFor="let tower of saleTowers" [value]="tower.id">
                  {{ tower.towerCode }} (Seller: {{ tower.ownerOperator?.name }})
                </mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Buyer Operator</mat-label>
              <mat-select name="buyerOperatorId" [(ngModel)]="transactionForm.buyerOperatorId">
                <mat-option *ngFor="let buyer of buyers" [value]="buyer.id">{{ buyer.name }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Agreed Price (INR)</mat-label>
              <input matInput type="number" name="agreedPrice" [(ngModel)]="transactionForm.agreedPrice" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Notes</mat-label>
              <input matInput name="notes" [(ngModel)]="transactionForm.notes" />
            </mat-form-field>
          </div>
          <div class="form-actions">
            <button mat-raised-button color="primary" (click)="buyTower()">Complete Purchase</button>
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
      .tx-table {
        width: 100%;
        margin-top: 16px;
      }
      .form-grid {
        display: grid;
        gap: 18px;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        margin-top: 16px;
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
  displayedColumns = ['tower', 'seller', 'buyer', 'agreedPrice', 'status'];

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
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

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
