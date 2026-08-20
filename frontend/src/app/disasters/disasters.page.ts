import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { forkJoin } from 'rxjs';
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
  template: `
    <ng-container *ngIf="disastersLoaded; else disastersLoading">
      <div class="page-shell">
        <div class="page-header">
        <div>
          <h2>Disaster Response</h2>
          <p>Register incidents, manage emergency sharing, and resolve active events.</p>
        </div>
      </div>

      <div class="section-grid">
        <mat-card class="summary-card">
          <mat-card-title>Active Incidents</mat-card-title>
          <mat-card-content>{{ activeIncidentCount }}</mat-card-content>
        </mat-card>
        <mat-card class="summary-card">
          <mat-card-title>Emergency Shares</mat-card-title>
          <mat-card-content>{{ emergencySharings.length }}</mat-card-content>
        </mat-card>
      </div>

      <mat-card>
        <mat-card-title>Disaster Incidents</mat-card-title>
        <mat-card-content>
          <table mat-table [dataSource]="incidents" class="mat-elevation-z2 incident-table">
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef> Title </th>
              <td mat-cell *matCellDef="let incident"> {{ incident.title }} </td>
            </ng-container>
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef> Type </th>
              <td mat-cell *matCellDef="let incident"> {{ incident.disasterType }} </td>
            </ng-container>
            <ng-container matColumnDef="region">
              <th mat-header-cell *matHeaderCellDef> Region </th>
              <td mat-cell *matCellDef="let incident"> {{ incident.region }} </td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef> Status </th>
              <td mat-cell *matCellDef="let incident"> {{ incident.status }} </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Actions </th>
              <td mat-cell *matCellDef="let incident">
                <button mat-icon-button color="primary" *ngIf="incident.status !== 'RESOLVED'" (click)="resolveIncident(incident.id)">
                  <mat-icon>check_circle</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="incidentColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: incidentColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>Emergency Sharing</mat-card-title>
        <mat-card-content>
          <table mat-table [dataSource]="emergencySharings" class="mat-elevation-z2 sharing-table">
            <ng-container matColumnDef="incident">
              <th mat-header-cell *matHeaderCellDef> Incident </th>
              <td mat-cell *matCellDef="let item"> {{ item.incident?.title }} </td>
            </ng-container>
            <ng-container matColumnDef="hostTower">
              <th mat-header-cell *matHeaderCellDef> Host Tower </th>
              <td mat-cell *matCellDef="let item"> {{ item.hostTower?.towerCode }} </td>
            </ng-container>
            <ng-container matColumnDef="sharedCapacity">
              <th mat-header-cell *matHeaderCellDef> Shared Capacity </th>
              <td mat-cell *matCellDef="let item"> {{ item.sharedCapacity }} </td>
            </ng-container>
            <ng-container matColumnDef="days">
              <th mat-header-cell *matHeaderCellDef> Days </th>
              <td mat-cell *matCellDef="let item"> {{ item.days }} </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="sharingColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: sharingColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <div class="form-grid">
        <mat-card>
          <mat-card-title>Register Incident</mat-card-title>
          <mat-card-content>
            <div class="form-grid-inner">
              <mat-form-field appearance="outline">
                <mat-label>Title</mat-label>
                <input matInput [(ngModel)]="incidentForm.title" name="title" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Disaster Type</mat-label>
                <mat-select [(ngModel)]="incidentForm.disasterType" name="disasterType">
                  <mat-option value="FLOOD">FLOOD</mat-option>
                  <mat-option value="EARTHQUAKE">EARTHQUAKE</mat-option>
                  <mat-option value="STORM">STORM</mat-option>
                  <mat-option value="FIRE">FIRE</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Region</mat-label>
                <input matInput [(ngModel)]="incidentForm.region" name="region" />
              </mat-form-field>
              <mat-form-field appearance="outline" class="span-full">
                <mat-label>Description</mat-label>
                <input matInput [(ngModel)]="incidentForm.description" name="description" />
              </mat-form-field>
              <mat-form-field appearance="outline" class="span-full">
                <mat-label>Affected Towers</mat-label>
                <mat-select [(ngModel)]="incidentForm.affectedTowerIds" name="affectedTowerIds" multiple>
                  <mat-option *ngFor="let tower of towers" [value]="tower.id">{{ tower.towerCode }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="form-actions">
              <button mat-raised-button color="primary" (click)="registerIncident()">Create Incident</button>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-title>Emergency Sharing</mat-card-title>
          <mat-card-content>
            <div class="form-grid-inner">
              <mat-form-field appearance="outline">
                <mat-label>Incident</mat-label>
                <mat-select [(ngModel)]="sharingForm.incidentId" name="incidentId">
                  <mat-option *ngFor="let incident of incidents" [value]="incident.id">{{ incident.title }}</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Host Tower</mat-label>
                <mat-select [(ngModel)]="sharingForm.hostTowerId" name="hostTowerId">
                  <mat-option *ngFor="let tower of towers" [value]="tower.id">{{ tower.towerCode }}</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Damaged Tower</mat-label>
                <mat-select [(ngModel)]="sharingForm.damagedTowerId" name="damagedTowerId">
                  <mat-option *ngFor="let tower of towers" [value]="tower.id">{{ tower.towerCode }}</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Host Operator</mat-label>
                <mat-select [(ngModel)]="sharingForm.hostOperatorId" name="hostOperatorId">
                  <mat-option *ngFor="let operator of operators" [value]="operator.id">{{ operator.name }}</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Affected Operator</mat-label>
                <mat-select [(ngModel)]="sharingForm.affectedOperatorId" name="affectedOperatorId">
                  <mat-option *ngFor="let operator of operators" [value]="operator.id">{{ operator.name }}</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Shared Capacity</mat-label>
                <input matInput type="number" [(ngModel)]="sharingForm.sharedCapacity" name="sharedCapacity" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Daily Rate</mat-label>
                <input matInput type="number" [(ngModel)]="sharingForm.dailyRate" name="dailyRate" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Days</mat-label>
                <input matInput type="number" [(ngModel)]="sharingForm.days" name="days" />
              </mat-form-field>
            </div>
            <div class="form-actions">
              <button mat-raised-button color="primary" (click)="createEmergencySharing()">Create Emergency Share</button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  </ng-container>

  <ng-template #disastersLoading>
    <div class="page-shell">
      <mat-card>
        <mat-card-title>Loading disaster dashboard...</mat-card-title>
        <mat-card-content>Please wait while incident and sharing data are loaded.</mat-card-content>
      </mat-card>
    </div>
  </ng-template>
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
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 18px;
      }
      .summary-card {
        background: #111827;
        color: #e0e7ff;
        min-height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .incident-table,
      .sharing-table {
        width: 100%;
        margin-top: 16px;
      }
      .form-grid {
        display: grid;
        gap: 18px;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      }
      .form-grid-inner {
        display: grid;
        gap: 18px;
      }
      .span-full {
        grid-column: span 2;
      }
      .form-actions {
        margin-top: 18px;
      }
      :host-context(html:not(.light-theme)) .page-shell,
      :host-context(html:not(.light-theme)) .mat-mdc-table,
      :host-context(html:not(.light-theme)) .mat-mdc-header-cell,
      :host-context(html:not(.light-theme)) .mat-mdc-cell,
      :host-context(html:not(.light-theme)) .mat-mdc-form-field,
      :host-context(html:not(.light-theme)) .mdc-floating-label,
      :host-context(html:not(.light-theme)) .mat-mdc-select-value,
      :host-context(html:not(.light-theme)) input {
        color: #e2e8f0 !important;
      }
      :host-context(html:not(.light-theme)) .mat-mdc-table {
        background: #0f172a !important;
      }
      :host-context(html.light-theme) .page-header p {
        color: #475569 !important;
      }
      :host-context(html.light-theme) .mat-mdc-table,
      :host-context(html.light-theme) .mat-mdc-header-cell,
      :host-context(html.light-theme) .mat-mdc-cell,
      :host-context(html.light-theme) .mat-mdc-form-field,
      :host-context(html.light-theme) .mdc-floating-label,
      :host-context(html.light-theme) .mat-mdc-select-value,
      :host-context(html.light-theme) input {
        color: #0f172a !important;
      }
      :host-context(html.light-theme) .mat-mdc-table {
        background: #ffffff !important;
      }
    `
  ]
})
export class DisastersPage implements OnInit {
  incidents: any[] = [];
  emergencySharings: any[] = [];
  towers: any[] = [];
  operators: any[] = [];
  disastersLoaded = false;
  incidentColumns = ['title', 'type', 'region', 'status', 'actions'];
  sharingColumns = ['incident', 'hostTower', 'sharedCapacity', 'days'];

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
    sharedCapacity: 0,
    dailyRate: 0,
    days: 0
  };

  constructor(
    private readonly disasterService: DisasterService,
    private readonly towerService: TowerService,
    private readonly operatorService: OperatorService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
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
        this.disastersLoaded = true;
      },
      error: () => {
        this.disastersLoaded = true;
        this.snackBar.open('Unable to load disaster data.', 'Close', { duration: 3000 });
      }
    });
  }

  public registerIncident(): void {
    this.disasterService.createIncident(this.incidentForm).subscribe({
      next: () => {
        this.snackBar.open('Incident created successfully.', 'Close', { duration: 3000 });
        this.incidentForm = { title: '', disasterType: 'FLOOD', description: '', region: '', affectedTowerIds: [] };
        this.loadData();
      },
      error: () => this.snackBar.open('Unable to create incident.', 'Close', { duration: 3000 })
    });
  }

  public resolveIncident(id: number): void {
    this.disasterService.resolveIncident(id).subscribe({
      next: () => {
        this.snackBar.open('Incident resolved.', 'Close', { duration: 3000 });
        this.loadData();
      },
      error: () => this.snackBar.open('Unable to resolve incident.', 'Close', { duration: 3000 })
    });
  }

  public createEmergencySharing(): void {
    this.disasterService.createEmergencySharing(this.sharingForm).subscribe({
      next: () => {
        this.snackBar.open('Emergency sharing created.', 'Close', { duration: 3000 });
        this.sharingForm = {
          incidentId: null,
          damagedTowerId: null,
          hostTowerId: null,
          affectedOperatorId: null,
          hostOperatorId: null,
          sharedCapacity: 0,
          dailyRate: 0,
          days: 0
        };
        this.loadData();
      },
      error: () => this.snackBar.open('Unable to create emergency sharing.', 'Close', { duration: 3000 })
    });
  }
}
