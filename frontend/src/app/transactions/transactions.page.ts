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
  displayedColumns = ['tower', 'seller', 'buyer', 'agreedPrice', 'status', 'actions'];

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
    if (!this.isAdmin && this.isOperatorUser) {
      const userState = (this.currentUser?.state || '').trim().toLowerCase();
      return this.saleTowers.filter((t) => {
        const notMine = this.currentUser?.operatorId ? t.ownerOperator?.id !== this.currentUser.operatorId : true;
        const sameState = userState ? (t.state || '').trim().toLowerCase() === userState : true;
        return notMine && sameState;
      });
    }
    return this.saleTowers;
  }

  public getDisplayedTransactions(): any[] {
    if (!this.isAdmin && this.isOperatorUser) {
      const opId = this.currentUser?.operatorId;
      const userState = (this.currentUser?.state || '').trim().toLowerCase();
      return this.transactions.filter((tx) => {
        const isRelatedOp = opId ? (tx.buyerOperator?.id === opId || tx.sellerOperator?.id === opId || tx.tower?.ownerOperator?.id === opId) : true;
        const towerState = (tx.tower?.state || '').trim().toLowerCase();
        const isSameState = userState ? (towerState === userState) : true;
        return isRelatedOp && isSameState;
      });
    }
    return this.transactions;
  }

  public canApproveTransaction(tx: any): boolean {
    if (this.isAdmin) return true;
    if (this.isOperatorUser && this.currentUser?.operatorId) {
      const sellerId = tx.sellerOperator?.id || tx.tower?.ownerOperator?.id;
      return sellerId === this.currentUser.operatorId;
    }
    return false;
  }

  public approveTransaction(id: number): void {
    const tx = this.transactions.find((t) => t.id === id);
    const towerLabel = tx?.tower?.name || tx?.tower?.towerCode || 'this tower';
    const buyerName = tx?.buyerOperator?.name || 'the buyer operator';
    const priceFormatted = tx?.agreedPrice ? `₹${tx.agreedPrice.toLocaleString()}` : '';

    if (!window.confirm(`Are you sure you want to APPROVE the sale of tower "${towerLabel}" to ${buyerName} for ${priceFormatted}?\n\nThis will transfer full tower asset ownership to ${buyerName}.`)) {
      return;
    }

    this.transactionService.approveTransaction(id).subscribe({
      next: () => {
        this.snackBar.open(`Tower sale approved! Ownership has been transferred to ${buyerName}.`, 'Close', { duration: 4000 });
        this.loadData();
      },
      error: (err: any) => {
        const msg = err?.error?.message || err?.error || 'Unable to approve transaction.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  public rejectTransaction(id: number): void {
    const tx = this.transactions.find((t) => t.id === id);
    const towerLabel = tx?.tower?.name || tx?.tower?.towerCode || 'this tower';
    const buyerName = tx?.buyerOperator?.name || 'the buyer operator';

    if (!window.confirm(`Are you sure you want to REJECT the purchase request for tower "${towerLabel}" from ${buyerName}?`)) {
      return;
    }

    this.transactionService.rejectTransaction(id).subscribe({
      next: () => {
        this.snackBar.open(`Purchase request from ${buyerName} has been rejected.`, 'Close', { duration: 3500 });
        this.loadData();
      },
      error: (err: any) => {
        const msg = err?.error?.message || err?.error || 'Unable to reject transaction.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
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

    const towerLabel = selectedTower ? `"${selectedTower.name}" (${selectedTower.towerCode})` : 'this tower';
    const sellerName = selectedTower?.ownerOperator?.name || 'seller operator';
    if (!window.confirm(`Are you sure you want to send a purchase request for tower ${towerLabel} to ${sellerName} for ₹${this.transactionForm.agreedPrice.toLocaleString()}?`)) {
      return;
    }

    this.transactionService.buyTower(this.transactionForm).subscribe({
      next: () => {
        this.snackBar.open(`Purchase request submitted to ${sellerName} for approval.`, 'Close', { duration: 3500 });
        this.transactionForm = {
          towerId: null,
          buyerOperatorId: (!this.isAdmin && this.currentUser?.operatorId) ? this.currentUser.operatorId : null,
          agreedPrice: 0,
          notes: ''
        };
        this.selectedTower = null;
        this.loadData();
      },
      error: () => this.snackBar.open('Unable to submit purchase request.', 'Close', { duration: 3000 })
    });
  }

  public selectedTower: any = null;

  onTowerSelected(): void {
    this.selectedTower = this.saleTowers.find(
      t => t.id === this.transactionForm.towerId
    );

    if (this.selectedTower) {
      this.transactionForm.agreedPrice =
        this.selectedTower.salePrice || 0;
    }
  }
}
