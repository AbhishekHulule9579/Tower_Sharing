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
import { DisasterService } from '../services/disaster.service';
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
  selector: 'app-disasters',
  templateUrl: './disasters.page.html',
  styleUrls: ['./disasters.page.css']
})
export class DisastersPage implements OnInit, OnDestroy {
  incidents: any[] = [];
  emergencySharings: any[] = [];
  towers: any[] = [];
  operators: any[] = [];
  disastersLoaded = false;
  incidentColumns = ['title', 'type', 'region', 'status', 'actions'];
  sharingColumns = ['incident', 'hostTower', 'sharedCapacity', 'days'];

  currentUser: AuthUser | null = null;
  isAdmin = false;
  isOperatorUser = false;
  private authSubscription?: Subscription;

  get activeIncidentCount(): number {
    return this.incidents.filter((i: any) => i.status === 'ACTIVE').length;
  }

  incidentForm: any = {
    title: '',
    disasterType: 'FLOOD',
    description: '',
    region: '',
    affectedTowerIds: []
  };

  sharingForm: any = {
    incidentId: null,
    damagedTowerId: null,
    hostTowerId: null,
    affectedOperatorId: null,
    hostOperatorId: null,
    sharedCapacity: 10,
    dailyRate: 2500,
    days: 30
  };

  constructor(
    private readonly disasterService: DisasterService,
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
      this.sharingForm.affectedOperatorId = this.currentUser.operatorId;
    }
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

  public getSelectableDamagedTowers(): any[] {
    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId) {
      return this.towers.filter((t) => t.ownerOperator?.id === this.currentUser?.operatorId);
    }
    return this.towers;
  }

  public getSelectableHostTowers(): any[] {
    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId) {
      return this.towers.filter((t) => t.ownerOperator?.id !== this.currentUser?.operatorId);
    }
    return this.towers;
  }

  public getSelectableHostOperators(): any[] {
    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId) {
      return this.operators.filter((op) => op.id !== this.currentUser?.operatorId);
    }
    return this.operators;
  }

  public getDisplayedSharings(): any[] {
    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId) {
      return this.emergencySharings.filter(
        (s) =>
          s.affectedOperator?.id === this.currentUser?.operatorId ||
          s.hostOperator?.id === this.currentUser?.operatorId
      );
    }
    return this.emergencySharings;
  }

  public onHostTowerChange(towerId: number): void {
    const hostTower = this.towers.find((t) => t.id === towerId);
    if (hostTower?.ownerOperator?.id) {
      this.sharingForm.hostOperatorId = hostTower.ownerOperator.id;
    }
  }

  private loadData(): void {
    forkJoin({
      incidents: this.disasterService.getIncidents(),
      emergencySharings: this.disasterService.getEmergencySharings(),
      towers: this.towerService.getAll(),
      operators: this.operatorService.getAllOperators()
    }).subscribe({
      next: ({ incidents, emergencySharings, towers, operators }) => {
        this.incidents = incidents || [];
        this.emergencySharings = emergencySharings || [];
        this.towers = towers || [];
        this.operators = operators || [];
        this.syncPredefinedOperator();
        this.disastersLoaded = true;
      },
      error: () => {
        this.disastersLoaded = true;
        this.snackBar.open('Unable to load disaster data.', 'Close', { duration: 3000 });
      }
    });
  }

  public registerIncident(): void {
    if (!this.incidentForm.title?.trim()) {
      this.snackBar.open('⚠️ Incident title is required.', 'Close', { duration: 3500 });
      return;
    }

    if (!this.incidentForm.region?.trim()) {
      this.snackBar.open('⚠️ Incident region / location is required.', 'Close', { duration: 3500 });
      return;
    }

    if (!this.incidentForm.disasterType) {
      this.snackBar.open('⚠️ Please select a disaster type.', 'Close', { duration: 3500 });
      return;
    }

    this.disasterService.createIncident(this.incidentForm).subscribe({
      next: () => {
        this.snackBar.open('✓ Incident created successfully.', 'Close', { duration: 3500 });
        this.incidentForm = { title: '', disasterType: 'FLOOD', description: '', region: '', affectedTowerIds: [] };
        this.loadData();
      },
      error: () => this.snackBar.open('⚠️ Unable to create incident.', 'Close', { duration: 3500 })
    });
  }

  public resolveIncident(id: number): void {
    this.disasterService.resolveIncident(id).subscribe({
      next: () => {
        this.snackBar.open('✓ Incident marked as resolved.', 'Close', { duration: 3500 });
        this.loadData();
      },
      error: () => this.snackBar.open('⚠️ Unable to resolve incident.', 'Close', { duration: 3500 })
    });
  }

  public createEmergencySharing(): void {
    if (!this.sharingForm.incidentId) {
      this.snackBar.open('⚠️ Please select an active incident.', 'Close', { duration: 3500 });
      return;
    }

    if (!this.sharingForm.damagedTowerId) {
      this.snackBar.open('⚠️ Please select your damaged/affected tower.', 'Close', { duration: 3500 });
      return;
    }

    if (!this.sharingForm.hostTowerId) {
      this.snackBar.open('⚠️ Please select a host tower from another operator.', 'Close', { duration: 3500 });
      return;
    }

    if (this.sharingForm.damagedTowerId === this.sharingForm.hostTowerId) {
      this.snackBar.open('⚠️ Damaged tower and host tower cannot be the same tower.', 'Close', { duration: 4000 });
      return;
    }

    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId) {
      this.sharingForm.affectedOperatorId = this.currentUser.operatorId;
    }

    if (!this.sharingForm.affectedOperatorId) {
      this.snackBar.open('⚠️ Please specify the affected operator.', 'Close', { duration: 3500 });
      return;
    }

    if (!this.sharingForm.hostOperatorId) {
      this.snackBar.open('⚠️ Please specify the host operator.', 'Close', { duration: 3500 });
      return;
    }

    if (this.sharingForm.affectedOperatorId === this.sharingForm.hostOperatorId) {
      this.snackBar.open('⚠️ Emergency sharing requires backup from a different host operator.', 'Close', { duration: 4000 });
      return;
    }

    if (!this.sharingForm.sharedCapacity || this.sharingForm.sharedCapacity <= 0) {
      this.snackBar.open('⚠️ Shared capacity must be greater than 0 TRX.', 'Close', { duration: 3500 });
      return;
    }

    if (!this.sharingForm.days || this.sharingForm.days < 1) {
      this.snackBar.open('⚠️ Emergency sharing duration must be at least 1 day.', 'Close', { duration: 3500 });
      return;
    }

    this.disasterService.createEmergencySharing(this.sharingForm).subscribe({
      next: () => {
        this.snackBar.open('Emergency sharing arrangement recorded.', 'Close', { duration: 3000 });
        this.sharingForm = {
          incidentId: null,
          damagedTowerId: null,
          hostTowerId: null,
          affectedOperatorId: (!this.isAdmin && this.currentUser?.operatorId) ? this.currentUser.operatorId : null,
          hostOperatorId: null,
          sharedCapacity: 10,
          dailyRate: 2500,
          days: 30
        };
        this.loadData();
      },
      error: (err) => {
        const msg = err?.error?.message || err?.error || 'Unable to create emergency sharing.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }
}
