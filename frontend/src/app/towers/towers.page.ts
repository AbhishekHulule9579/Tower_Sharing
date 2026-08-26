import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { forkJoin, Subscription } from 'rxjs';
import { AuthService, AuthUser } from '../services/auth.service';
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
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatDividerModule,
    MatPaginatorModule
  ],
  selector: 'app-towers',
  templateUrl: './towers.page.html',
  styleUrls: ['./towers.page.css']
})
export class TowersPage implements OnInit, OnDestroy {
  towers: any[] = [];
  availableForLease: any[] = [];
  availableForSale: any[] = [];
  operators: any[] = [];
  selectedTower: any | null = null;

  currentUser: AuthUser | null = null;
  isAdmin = false;
  isOperatorUser = false;
  canManageTowers = false;
  private authSubscription?: Subscription;

  // Search & Pagination
  searchTerm = '';
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 100];

  displayedColumns = [
    'towerCode',
    'name',
    'location',
    'status',
    'sharingStatus',
    'actions'
  ];

  towerForm: any = {
    towerCode: '',
    name: '',
    location: '',
    city: '',
    state: '',
    latitude: 0,
    longitude: 0,
    totalCapacity: 0,
    currentOccupancy: 0,
    ownerOperatorId: null,
    status: 'ACTIVE',
    sharingStatus: 'AVAILABLE_FOR_LEASE',
    monthlyLeaseRate: 0,
    salePrice: 0
  };

  dataLoaded = false;

  notification = {
    show: false,
    type: 'error',
    message: ''
  };

  private notificationTimer: any;

  constructor(
    private readonly towerService: TowerService,
    private readonly operatorService: OperatorService,
    private readonly authService: AuthService
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
    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }
  }

  private updateUserPermissions(): void {
    const role = this.currentUser?.role;
    this.isAdmin = role === 'ADMIN';
    this.isOperatorUser = role === 'OPERATOR_MANAGER' || role === 'SITE_MANAGER';
    // Admin role is strictly governance read-only. Add/edit is reserved for Operator Managers & Site Managers.
    this.canManageTowers = !this.isAdmin && this.isOperatorUser;
  }

  private syncPredefinedOperator(): void {
    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId && !this.selectedTower) {
      this.towerForm.ownerOperatorId = this.currentUser.operatorId;
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
      const match = this.operators.find((op) => op.id === this.currentUser?.operatorId);
      if (match) return match.name;
    }
    return '';
  }

  public getRawDisplayedTowers(): any[] {
    if (this.isOperatorUser && !this.isAdmin && this.currentUser?.operatorId) {
      return this.towers.filter((t) => t.ownerOperator?.id === this.currentUser?.operatorId);
    }
    return this.towers;
  }

  public getFilteredTowers(): any[] {
    const raw = this.getRawDisplayedTowers();
    const query = this.searchTerm.toLowerCase().trim();
    if (!query) {
      return raw;
    }
    return raw.filter((t) =>
      `${t.towerCode || ''} ${t.name || ''} ${t.location || ''} ${t.city || ''} ${t.state || ''} ${t.status || ''} ${t.ownerOperator?.name || ''}`
        .toLowerCase()
        .includes(query)
    );
  }

  public getPaginatedTowers(): any[] {
    const filtered = this.getFilteredTowers();
    const start = this.pageIndex * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  public onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  public onSearchChange(): void {
    this.pageIndex = 0;
  }

  public canEditTower(tower: any): boolean {
    if (this.isAdmin) {
      return false; // Governance read-only for admin
    }
    if (this.isOperatorUser && this.currentUser?.operatorId) {
      return tower.ownerOperator?.id === this.currentUser.operatorId;
    }
    return false;
  }

  // Admin stats
  public getActiveCount(): number {
    return this.getRawDisplayedTowers().filter((t) => t.status === 'ACTIVE').length;
  }

  public getMaintenanceCount(): number {
    return this.getRawDisplayedTowers().filter(
      (t) => t.status === 'UNDER_MAINTENANCE' || t.status === 'MAINTENANCE'
    ).length;
  }

  public getDisruptedCount(): number {
    return this.getRawDisplayedTowers().filter(
      (t) => t.status === 'DISASTER_AFFECTED' || t.status === 'INACTIVE_DAMAGED' || t.status === 'INACTIVE'
    ).length;
  }

  private loadData(): void {
    forkJoin({
      towers: this.towerService.getAll(),
      operators: this.operatorService.getAllOperators()
    }).subscribe({
      next: (result) => {
        this.towers = result.towers || [];
        this.operators = result.operators || [];

        this.availableForLease = this.towers.filter(
          (tower) => tower.sharingStatus === 'AVAILABLE_FOR_LEASE'
        );

        this.availableForSale = this.towers.filter(
          (tower) => tower.sharingStatus === 'AVAILABLE_FOR_SALE'
        );

        this.syncPredefinedOperator();

        Promise.resolve().then(() => {
          this.dataLoaded = true;
        });
      },

      error: (error) => {
        this.dataLoaded = true;
        this.showNotification(
          'error',
          this.getErrorMessage(error, 'Unable to load tower data.')
        );
      }
    });
  }

  public saveTower(): void {
    if (!this.canManageTowers) {
      this.showNotification(
        'error',
        'Only Company Site Managers or Operator Managers can add or edit towers.'
      );
      return;
    }

    if (!this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId) {
      this.towerForm.ownerOperatorId = this.currentUser.operatorId;
    }

    const validationError = this.validateTower();
    if (validationError) {
      this.showNotification('warning', validationError);
      return;
    }

    const payload = {
      ...this.towerForm,
      ownerOperator: {
        id: this.towerForm.ownerOperatorId
      }
    };

    if (this.selectedTower?.id) {
      if (!this.canEditTower(this.selectedTower)) {
        this.showNotification(
          'error',
          'You are only authorized to modify towers belonging to your operator company.'
        );
        return;
      }

      this.towerService.updateTower(this.selectedTower.id, payload).subscribe({
        next: () => {
          this.showNotification('success', 'Tower updated successfully.');
          this.resetForm(false);
          this.loadData();
        },
        error: (error) => {
          this.showNotification('error', this.getErrorMessage(error, 'Unable to update the tower.'));
        }
      });
      return;
    }

    this.towerService.createTower(payload).subscribe({
      next: () => {
        this.showNotification('success', 'Tower created successfully.');
        this.resetForm(false);
        this.loadData();
      },
      error: (error) => {
        this.showNotification('error', this.getErrorMessage(error, 'Unable to create the tower.'));
      }
    });
  }

  private validateTower(): string | null {
    if (!this.towerForm.towerCode?.trim()) {
      return 'Tower Code is required.';
    }

    if (!this.towerForm.name?.trim()) {
      return 'Tower Name is required.';
    }

    if (!this.towerForm.city?.trim()) {
      return 'City is required.';
    }

    if (!this.towerForm.state?.trim()) {
      return 'State is required.';
    }

    if (!this.towerForm.location?.trim()) {
      return 'Location is required.';
    }

    if (!this.towerForm.ownerOperatorId) {
      return 'Please select an Owner Operator.';
    }

    if (!this.towerForm.status) {
      return 'Please select a Status.';
    }

    if (!this.towerForm.sharingStatus) {
      return 'Please select a Sharing Status.';
    }

    if (
      this.towerForm.totalCapacity === null ||
      this.towerForm.totalCapacity === '' ||
      this.towerForm.totalCapacity <= 0
    ) {
      return 'Total Capacity must be greater than 0.';
    }

    if (
      this.towerForm.currentOccupancy === null ||
      this.towerForm.currentOccupancy === '' ||
      this.towerForm.currentOccupancy < 0
    ) {
      return 'Current Occupancy cannot be empty or negative.';
    }

    if (this.towerForm.currentOccupancy > this.towerForm.totalCapacity) {
      return 'Current Occupancy cannot be greater than Total Capacity.';
    }

    if (
      this.towerForm.monthlyLeaseRate === null ||
      this.towerForm.monthlyLeaseRate === '' ||
      this.towerForm.monthlyLeaseRate < 0
    ) {
      return 'Monthly Lease Rate cannot be negative.';
    }

    if (
      this.towerForm.salePrice === null ||
      this.towerForm.salePrice === '' ||
      this.towerForm.salePrice < 0
    ) {
      return 'Sale Price cannot be negative.';
    }

    if (
      this.towerForm.latitude === null ||
      this.towerForm.latitude === '' ||
      this.towerForm.latitude < -90 ||
      this.towerForm.latitude > 90
    ) {
      return 'Latitude must be between -90 and 90.';
    }

    if (
      this.towerForm.longitude === null ||
      this.towerForm.longitude === '' ||
      this.towerForm.longitude < -180 ||
      this.towerForm.longitude > 180
    ) {
      return 'Longitude must be between -180 and 180.';
    }

    return null;
  }

  public editTower(tower: any): void {
    if (!this.canEditTower(tower)) {
      this.showNotification(
        'warning',
        'Administrator role is strictly governance read-only.'
      );
      return;
    }

    this.selectedTower = tower;

    this.towerForm = {
      towerCode: tower.towerCode || '',
      name: tower.name || '',
      location: tower.location || '',
      city: tower.city || '',
      state: tower.state || '',
      latitude: tower.latitude ?? 0,
      longitude: tower.longitude ?? 0,
      totalCapacity: tower.totalCapacity ?? 0,
      currentOccupancy: tower.currentOccupancy ?? 0,
      ownerOperatorId: tower.ownerOperator?.id ?? null,
      status: tower.status || 'ACTIVE',
      sharingStatus: tower.sharingStatus || 'AVAILABLE_FOR_LEASE',
      monthlyLeaseRate: tower.monthlyLeaseRate ?? 0,
      salePrice: tower.salePrice ?? 0
    };

    this.showNotification('success', `Editing tower ${tower.towerCode}.`);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }

  public deleteTower(id: number): void {
    if (!id) {
      this.showNotification('error', 'Invalid tower ID. Unable to delete the tower.');
      return;
    }

    const tower = this.towers.find((t) => t.id === id);
    if (tower && !this.canEditTower(tower)) {
      this.showNotification(
        'error',
        'Administrator role is strictly governance read-only.'
      );
      return;
    }

    const towerLabel = tower ? `"${tower.name}" (${tower.towerCode})` : `tower site (ID: ${id})`;
    if (!window.confirm(`Are you sure you want to PERMANENTLY DELETE ${towerLabel}?\n\nThis action cannot be undone and will remove all telemetry & lease mappings.`)) {
      return;
    }

    // Immediately remove from UI array for instant disappearing without waiting for manual refresh
    this.towers = this.towers.filter((t) => t.id !== id);
    this.availableForLease = this.availableForLease.filter((t) => t.id !== id);
    this.availableForSale = this.availableForSale.filter((t) => t.id !== id);
    if (this.selectedTower?.id === id) {
      this.resetForm(false);
    }
    if (this.getPaginatedTowers().length === 0 && this.pageIndex > 0) {
      this.pageIndex = Math.max(0, this.pageIndex - 1);
    }

    this.towerService.deleteTower(id).subscribe({
      next: () => {
        this.showNotification('success', `Tower ${towerLabel} deleted successfully.`);
        this.loadData();
      },
      // error: (error) => {
      //   this.showNotification('error', this.getErrorMessage(error, 'Unable to delete the tower.'));
      //   this.loadData();
      // }
    });
  }

  public resetForm(showMessage = true): void {
    this.selectedTower = null;

    const defaultOwnerId =
      !this.isAdmin && this.isOperatorUser && this.currentUser?.operatorId
        ? this.currentUser.operatorId
        : null;

    this.towerForm = {
      towerCode: '',
      name: '',
      location: '',
      city: '',
      state: '',
      latitude: 0,
      longitude: 0,
      totalCapacity: 0,
      currentOccupancy: 0,
      ownerOperatorId: defaultOwnerId,
      status: 'ACTIVE',
      sharingStatus: 'AVAILABLE_FOR_LEASE',
      monthlyLeaseRate: 0,
      salePrice: 0
    };

    if (showMessage) {
      this.showNotification('success', 'Form has been reset.');
    }
  }

  private showNotification(type: 'success' | 'error' | 'warning', message: string): void {
    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }

    this.notification = {
      show: true,
      type,
      message
    };

    this.notificationTimer = setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  public hideNotification(): void {
    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }

    this.notification = {
      show: false,
      type: 'error',
      message: ''
    };
  }

  private getErrorMessage(error: any, defaultMessage: string): string {
    if (!error) {
      return defaultMessage;
    }

    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    if (error.error?.message) {
      return error.error.message;
    }

    if (error.error?.error) {
      return error.error.error;
    }

    if (error.message) {
      return error.message;
    }

    if (error.status === 400) {
      return 'Invalid tower information. Please check all fields.';
    }

    if (error.status === 403) {
      return 'Access denied: You are only allowed to manage towers belonging to your operator company.';
    }

    if (error.status === 404) {
      return 'Tower or related resource was not found.';
    }

    if (error.status === 409) {
      return 'A tower with the same information already exists.';
    }

    if (error.status === 500) {
      return 'Server error. Please try again later.';
    }

    return defaultMessage;
  }
}