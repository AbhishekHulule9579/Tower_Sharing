import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { AuthService, AuthUser } from '../services/auth.service';
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
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.css']
})
export class TransactionsPage implements OnInit, OnDestroy {
  transactions: any[] = [];
  saleTowers: any[] = [];
  buyers: any[] = [];
  displayedColumns = ['tower', 'seller', 'buyer', 'agreedPrice', 'status'];

  currentUser: AuthUser | null = null;
  isAdmin = false;
  isOperatorUser = false;
  private authSubscription?: Subscription;

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
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.updateUserPermissions();

    this.authSubscription = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.updateUserPermissions();
      this.syncPredefinedBuyer();
    });

    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private updateUserPermissions(): void {
    const role = this.currentUser?.role;
    this.isAdmin = role === 'ADMIN';
    this.isOperatorUser = role === 'OPERATOR_MANAGER' || role === 'SITE_MANAGER';
  }

  private syncPredefinedBuyer(): void {
    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId) {
      this.transactionForm.buyerOperatorId = this.currentUser.operatorId;
    }
  }

  public getOperatorDisplayName(): string {
    if (this.currentUser?.operatorName) {
      return this.currentUser.operatorName;
    }
    if (this.currentUser?.operatorCode) {
      return this.currentUser.operatorCode;
    }
    if (this.currentUser?.operatorId) {
      const match = this.buyers.find((b) => b.id === this.currentUser?.operatorId);
      if (match) return match.name;
    }
    return '';
  }

  public getSelectableSaleTowers(): any[] {
    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId) {
      return this.saleTowers.filter((t) => t.ownerOperator?.id !== this.currentUser?.operatorId);
    }
    return this.saleTowers;
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
      this.syncPredefinedBuyer();
      this.changeDetector.detectChanges();
    });
  }

  public buyTower(): void {
    if (!this.transactionForm.towerId) {
      this.snackBar.open('⚠️ Please select an available tower to buy.', 'Close', { duration: 3500 });
      return;
    }

    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId) {
      this.transactionForm.buyerOperatorId = this.currentUser.operatorId;
    }

    if (!this.transactionForm.buyerOperatorId) {
      this.snackBar.open('⚠️ Please select the buyer operator.', 'Close', { duration: 3500 });
      return;
    }

    const selectedTower = this.saleTowers.find((t) => t.id === this.transactionForm.towerId);
    if (selectedTower && selectedTower.ownerOperator?.id === this.transactionForm.buyerOperatorId) {
      this.snackBar.open('⚠️ Cannot buy a tower that is already owned by your operator.', 'Close', { duration: 4000 });
      return;
    }

    if (!this.transactionForm.agreedPrice || this.transactionForm.agreedPrice <= 0) {
      this.snackBar.open('⚠️ Please enter a valid agreed purchase price greater than ₹0.', 'Close', { duration: 3500 });
      return;
    }

    this.transactionService.buyTower(this.transactionForm).subscribe({
      next: () => {
        this.snackBar.open('Tower purchase recorded successfully.', 'Close', { duration: 3000 });
        this.transactionForm = {
          towerId: null,
          buyerOperatorId: (!this.isAdmin && this.currentUser?.operatorId) ? this.currentUser.operatorId : null,
          agreedPrice: 0,
          notes: ''
        };
        this.loadData();
      },
      error: () => this.snackBar.open('Unable to submit purchase.', 'Close', { duration: 3000 })
    });
  }
}
