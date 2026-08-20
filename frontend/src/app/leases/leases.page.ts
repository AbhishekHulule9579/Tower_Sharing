import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { forkJoin, Subscription } from 'rxjs';
import { AuthService, AuthUser } from '../services/auth.service';
import { LeaseService } from '../services/lease.service';
import { OperatorService } from '../services/operator.service';
import { TowerService } from '../services/tower.service';

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
  selector: 'app-leases',
  templateUrl: './leases.page.html',
  styleUrls: ['./leases.page.css']
})
export class LeasesPage implements OnInit, OnDestroy {
  leases: any[] = [];
  allAvailableLeaseTowers: any[] = [];
  operators: any[] = [];
  displayedColumns = ['tower', 'operator', 'sharedCapacity', 'status', 'actions'];
  leaseLoaded = false;

  currentUser: AuthUser | null = null;
  isAdmin = false;
  isOperatorUser = false;
  private authSubscription?: Subscription;

  leaseForm: any = {
    towerId: null,
    lesseeOperatorId: null,
    sharedCapacity: 10,
    months: 12
  };

  constructor(
    private readonly leaseService: LeaseService,
    private readonly towerService: TowerService,
    private readonly operatorService: OperatorService,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.updateUserPermissions();

    this.authSubscription = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.updateUserPermissions();
      this.syncPredefinedOperator();
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

  private syncPredefinedOperator(): void {
    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId) {
      this.leaseForm.lesseeOperatorId = this.currentUser.operatorId;
    }
  }

  public getOperatorDisplayName(): string {
    return this.currentUser?.operatorName || this.currentUser?.operatorCode || '';
  }

  public getSelectableTowers(): any[] {
    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId) {
      return this.allAvailableLeaseTowers.filter(
        (t) => t.ownerOperator?.id !== this.currentUser?.operatorId
      );
    }
    return this.allAvailableLeaseTowers;
  }

  public canApproveLease(lease: any): boolean {
    if (this.isAdmin) return true;
    if (this.isOperatorUser && this.currentUser?.operatorId) {
      const ownerId = lease.tower?.ownerOperator?.id || lease.lessorOperator?.id;
      return ownerId === this.currentUser.operatorId;
    }
    return false;
  }

  public canTerminateLease(lease: any): boolean {
    if (this.isAdmin) return true;
    if (this.isOperatorUser && this.currentUser?.operatorId) {
      const ownerId = lease.tower?.ownerOperator?.id || lease.lessorOperator?.id;
      const lesseeId = lease.lesseeOperator?.id;
      return ownerId === this.currentUser.operatorId || lesseeId === this.currentUser.operatorId;
    }
    return false;
  }

  private loadData(): void {
    forkJoin({
      leases: this.leaseService.getAll(),
      availableTowers: this.towerService.getAvailableForLease(),
      operators: this.operatorService.getAllOperators()
    }).subscribe({
      next: ({ leases, availableTowers, operators }) => {
        this.leases = leases || [];
        this.allAvailableLeaseTowers = availableTowers || [];
        this.operators = operators || [];
        this.syncPredefinedOperator();
        this.leaseLoaded = true;
      },
      error: () => {
        this.leaseLoaded = true;
        this.snackBar.open('Unable to load lease information.', 'Close', { duration: 3000 });
      }
    });
  }

  public requestLease(): void {
    if (!this.leaseForm.towerId) {
      this.snackBar.open('⚠️ Please select a tower to request lease.', 'Close', { duration: 3500 });
      return;
    }

    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId) {
      this.leaseForm.lesseeOperatorId = this.currentUser.operatorId;
    }

    if (!this.leaseForm.lesseeOperatorId) {
      this.snackBar.open('⚠️ Please specify the lessee operator.', 'Close', { duration: 3500 });
      return;
    }

    const selectedTower = this.allAvailableLeaseTowers.find((t: any) => t.id === this.leaseForm.towerId);
    if (selectedTower && selectedTower.ownerOperator?.id === this.leaseForm.lesseeOperatorId) {
      this.snackBar.open('⚠️ Cannot lease a tower from your own company. Please select a tower owned by another operator.', 'Close', { duration: 4000 });
      return;
    }

    if (!this.leaseForm.sharedCapacity || this.leaseForm.sharedCapacity <= 0) {
      this.snackBar.open('⚠️ Shared capacity must be greater than 0 TRX slots.', 'Close', { duration: 3500 });
      return;
    }

    if (!this.leaseForm.months || this.leaseForm.months < 1) {
      this.snackBar.open('⚠️ Lease duration must be at least 1 month.', 'Close', { duration: 3500 });
      return;
    }

    this.leaseService.requestLease(this.leaseForm).subscribe({
      next: () => {
        this.snackBar.open('Lease request submitted successfully and is pending owner approval.', 'Close', {
          duration: 4000
        });
        this.leaseForm = {
          towerId: null,
          lesseeOperatorId: (!this.isAdmin && this.currentUser?.operatorId) ? this.currentUser.operatorId : null,
          sharedCapacity: 10,
          months: 12
        };
        this.loadData();
      },
      error: (err: any) => {
        const msg = err?.error?.message || err?.error || 'Unable to submit lease request.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  public approveLease(id: number, approved: boolean): void {
    this.leaseService.approveLease(id, approved, approved ? 'Approved by owner' : 'Rejected by owner').subscribe({
      next: () => {
        this.snackBar.open(
          `Lease ${approved ? 'approved and activated' : 'rejected'} successfully.`,
          'Close',
          { duration: 3000 }
        );
        this.loadData();
      },
      error: (err: any) => {
        const msg = err?.error?.message || err?.error || 'Unable to update lease status.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  public terminateLease(id: number): void {
    this.leaseService.terminateLease(id).subscribe({
      next: () => {
        this.snackBar.open('Lease terminated successfully.', 'Close', { duration: 3000 });
        this.loadData();
      },
      error: (err: any) => {
        const msg = err?.error?.message || err?.error || 'Unable to terminate lease.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }
}
