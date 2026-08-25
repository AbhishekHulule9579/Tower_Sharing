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
import { forkJoin, Subscription } from 'rxjs';
import { AuthService, AuthUser } from '../services/auth.service';
import { DisasterService } from '../services/disaster.service';
import { MaintenanceService } from '../services/maintenance.service';
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
  selector: 'app-maintenance',
  templateUrl: './maintenance.page.html',
  styleUrls: ['./maintenance.page.css']
})
export class MaintenancePage implements OnInit, OnDestroy {
  repairRequests: any[] = [];
  towers: any[] = [];
  siteManagers: any[] = [];
  dataLoaded = false;

  currentUser: AuthUser | null = null;
  isAdmin = false;
  isOperatorUser = false;
  private authSubscription?: Subscription;

  repairColumns = ['tower', 'priority', 'status', 'siteManager', 'actions'];

  repairForm: any = {
    towerId: null,
    incidentId: null,
    priority: 'HIGH',
    description: '',
    assignedSiteManagerId: null
  };

  restoreForm: any = {
    repairRequestId: null,
    maintenanceNotes: ''
  };

  constructor(
    private readonly maintenanceService: MaintenanceService,
    private readonly towerService: TowerService,
    private readonly disasterService: DisasterService,
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

  public getOperatorDisplayName(): string {
    return this.currentUser?.operatorName || this.currentUser?.operatorCode || '';
  }

  public getSelectableTowers(): any[] {
    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId) {
      return this.towers.filter((t) => t.ownerOperator?.id === this.currentUser?.operatorId);
    }
    return this.towers;
  }

  public getSelectableSiteManagers(): any[] {
    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId) {
      return this.siteManagers.filter((m) => m.operator?.id === this.currentUser?.operatorId);
    }
    return this.siteManagers;
  }

  public getDisplayedRepairs(): any[] {
    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId) {
      return this.repairRequests.filter(
        (r) => r.tower?.ownerOperator?.id === this.currentUser?.operatorId
      );
    }
    return this.repairRequests;
  }

  public getHighPriorityCount(): number {
    return this.getDisplayedRepairs().filter((r) => r.priority === 'HIGH').length;
  }

  public getManageableRepairs(): any[] {
    return this.getDisplayedRepairs().filter(
      (r) => r.status === 'REPORTED' || r.status === 'IN_PROGRESS' || r.status === 'PENDING'
    );
  }

  public canManageRepair(rep: any): boolean {
    if (this.isAdmin) return true;
    if (this.isOperatorUser && this.currentUser?.operatorId) {
      return rep.tower?.ownerOperator?.id === this.currentUser.operatorId;
    }
    return false;
  }

  private loadData(): void {
    forkJoin({
      repairs: this.maintenanceService.getRepairRequests(),
      towers: this.towerService.getAll(),
      siteManagers: this.operatorService.getSiteManagers()
    }).subscribe({
      next: (result) => {
        this.repairRequests = result.repairs || [];
        this.towers = result.towers || [];
        this.siteManagers = result.siteManagers || [];
        this.dataLoaded = true;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.dataLoaded = true;
        this.snackBar.open('Unable to load maintenance records.', 'Dismiss', {
          duration: 4000
        });
        this.changeDetector.detectChanges();
      }
    });
  }

  public selectForAction(rep: any): void {
    this.restoreForm.repairRequestId = rep.id;
    this.snackBar.open(`Selected Ticket #${rep.requestTicketCode || rep.id} for status restoration.`, 'OK', {
      duration: 3000
    });
  }

  public createRepairRequest(): void {
    if (!this.repairForm.towerId) {
      this.snackBar.open('Please select a target tower.', 'Dismiss', { duration: 3000 });
      return;
    }

    const payload = {
      tower: { id: this.repairForm.towerId },
      incident: this.repairForm.incidentId ? { id: this.repairForm.incidentId } : null,
      priority: this.repairForm.priority || 'HIGH',
      description: this.repairForm.description || 'Routine maintenance and inspection request',
      assignedSiteManager: this.repairForm.assignedSiteManagerId
        ? { id: this.repairForm.assignedSiteManagerId }
        : null
    };

    this.maintenanceService.createRepairRequest(payload).subscribe({
      next: () => {
        this.snackBar.open('Repair request work order created successfully.', 'Dismiss', { duration: 3500 });
        this.repairForm = {
          towerId: null,
          incidentId: null,
          priority: 'HIGH',
          description: '',
          assignedSiteManagerId: null
        };
        this.loadData();
      },
      error: () => {
        this.snackBar.open('Failed to create repair request.', 'Dismiss', { duration: 4000 });
      }
    });
  }

  public restoreTower(): void {
    if (!this.restoreForm.repairRequestId) {
      this.snackBar.open('Please select a repair request ticket to mark as restored.', 'Dismiss', { duration: 3000 });
      return;
    }

    const notes = this.restoreForm.maintenanceNotes || 'Maintenance completed successfully. Cell site returned to ACTIVE service.';
    this.maintenanceService.restoreTower(this.restoreForm.repairRequestId, { maintenanceNotes: notes }).subscribe({
      next: () => {
        this.snackBar.open('Tower status successfully restored to ACTIVE service.', 'Dismiss', { duration: 3500 });
        this.restoreForm = {
          repairRequestId: null,
          maintenanceNotes: ''
        };
        this.loadData();
      },
      error: () => {
        this.snackBar.open('Failed to restore tower status.', 'Dismiss', { duration: 4000 });
      }
    });
  }
}
