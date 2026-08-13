import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { OperatorService } from '../services/operator.service';

@Component({
  standalone: true,
  selector: 'app-operators',
  imports: [CommonModule, FormsModule, MatCardModule],
  template: `
    <div class="page-shell">

      <div class="page-header">
        <div>
          <div class="eyebrow">TOWERSYNC MANAGEMENT</div>
          <h1>Operators & Users</h1>
          <p>Monitor operators, platform users and site manager assignments.</p>
        </div>

        <button class="refresh-button" type="button" (click)="loadData()">
          ↻ Refresh
        </button>
      </div>

      <div class="summary-grid">

        <div class="summary-card blue">
          <div class="summary-icon">📡</div>
          <div>
            <span>Operators</span>
            <strong>{{ operators.length }}</strong>
            <small>Registered operators</small>
          </div>
        </div>

        <div class="summary-card purple">
          <div class="summary-icon">👥</div>
          <div>
            <span>Platform Users</span>
            <strong>{{ users.length }}</strong>
            <small>Active system users</small>
          </div>
        </div>

        <div class="summary-card green">
          <div class="summary-icon">👨‍💼</div>
          <div>
            <span>Site Managers</span>
            <strong>{{ siteManagers.length }}</strong>
            <small>Registered managers</small>
          </div>
        </div>

        <div class="summary-card orange">
          <div class="summary-icon">✓</div>
          <div>
            <span>System Status</span>
            <strong>Active</strong>
            <small>TowerSync services</small>
          </div>
        </div>

      </div>

      <div class="content-grid">

        <mat-card class="data-card operators-card">
          <div class="card-header">
            <div>
              <h2>📡 Operators</h2>
              <p>Telecom operators connected to TowerSync</p>
            </div>
            <span class="count blue-count">{{ operators.length }}</span>
          </div>

          <div class="search-box">
            <span>🔍</span>
            <input
              type="text"
              [(ngModel)]="operatorSearch"
              placeholder="Search operators...">
          </div>

          <div class="data-list">

            <div
              class="data-row"
              *ngFor="let operator of filteredOperators">

              <div class="row-icon operator-icon">
                📡
              </div>

              <div class="row-content">
                <strong>{{ operator.name }}</strong>
                <span>{{ operator.code }}</span>
              </div>

              <div class="row-right">
                <span class="email">{{ operator.contactEmail }}</span>
                <span class="active-badge">Active</span>
              </div>

            </div>

            <div
              class="empty-state"
              *ngIf="filteredOperators.length === 0">

              <span>📡</span>
              <strong>No operators found</strong>
              <small>There are no operators matching your search.</small>

            </div>

          </div>
        </mat-card>

        <mat-card class="data-card users-card">
          <div class="card-header">
            <div>
              <h2>👥 Platform Users</h2>
              <p>Users registered in the system</p>
            </div>
            <span class="count purple-count">{{ users.length }}</span>
          </div>

          <div class="search-box">
            <span>🔍</span>
            <input
              type="text"
              [(ngModel)]="userSearch"
              placeholder="Search users...">
          </div>

          <div class="data-list">

            <div
              class="data-row"
              *ngFor="let user of filteredUsers">

              <div class="row-icon user-icon">
                👤
              </div>

              <div class="row-content">
                <strong>{{ user.username || user.email }}</strong>
                <span>{{ user.email }}</span>
              </div>

              <div class="row-right">
                <span class="role-badge">
                  {{ user.role }}
                </span>
              </div>

            </div>

            <div
              class="empty-state"
              *ngIf="filteredUsers.length === 0">

              <span>👥</span>
              <strong>No users found</strong>
              <small>There are no users matching your search.</small>

            </div>

          </div>
        </mat-card>

        <mat-card class="data-card managers-card">

          <div class="card-header">
            <div>
              <h2>👨‍💼 Site Managers</h2>
              <p>Managers responsible for site operations</p>
            </div>
            <span class="count green-count">{{ siteManagers.length }}</span>
          </div>

          <div class="search-box">
            <span>🔍</span>
            <input
              type="text"
              [(ngModel)]="managerSearch"
              placeholder="Search site managers...">
          </div>

          <div class="data-list">

            <div
              class="data-row"
              *ngFor="let manager of filteredManagers">

              <div class="row-icon manager-icon">
                👨‍💼
              </div>

              <div class="row-content">
                <strong>
                  {{ manager.username || manager.email }}
                </strong>

                <span>
                  {{ manager.email }}
                </span>
              </div>

              <div class="row-right">
                <span class="manager-badge">
                  {{ manager.role }}
                </span>
              </div>

            </div>

            <div
              class="empty-state"
              *ngIf="filteredManagers.length === 0">

              <span>👨‍💼</span>
              <strong>No site managers found</strong>
              <small>There are no managers matching your search.</small>

            </div>

          </div>

        </mat-card>

      </div>

    </div>
  `,

  styles: [`
    *{box-sizing:border-box}

    .page-shell{
      min-height:100%;
      padding:28px;
      color:#e2e8f0;
      background:
        radial-gradient(circle at 80% 5%,rgba(59,130,246,.08),transparent 30%),
        radial-gradient(circle at 15% 90%,rgba(124,58,237,.07),transparent 30%)
    }

    .page-header{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:20px;
      margin-bottom:25px
    }

    .eyebrow{
      margin-bottom:6px;
      color:#60a5fa;
      font-size:10px;
      font-weight:700;
      letter-spacing:1.5px
    }

    .page-header h1{
      margin:0;
      color:#f8fafc;
      font-size:30px;
      font-weight:750;
      letter-spacing:-.5px
    }

    .page-header p{
      margin:6px 0 0;
      color:#94a3b8;
      font-size:13px
    }

    .refresh-button{
      height:40px;
      padding:0 17px;
      border:1px solid rgba(96,165,250,.2);
      border-radius:10px;
      background:rgba(59,130,246,.08);
      color:#93c5fd;
      font-size:12px;
      font-weight:600;
      cursor:pointer;
      transition:.2s
    }

    .refresh-button:hover{
      background:rgba(59,130,246,.16);
      transform:translateY(-1px)
    }

    .summary-grid{
      display:grid;
      grid-template-columns:repeat(4,1fr);
      gap:16px;
      margin-bottom:22px
    }

    .summary-card{
      position:relative;
      display:flex;
      align-items:center;
      gap:15px;
      min-height:125px;
      padding:20px;
      overflow:hidden;
      border:1px solid rgba(148,163,184,.1);
      border-radius:17px;
      background:#111827;
      box-shadow:0 8px 25px rgba(0,0,0,.12);
      transition:.2s
    }

    .summary-card:hover{
      transform:translateY(-3px);
      box-shadow:0 15px 35px rgba(0,0,0,.2)
    }

    .summary-card:after{
      content:'';
      position:absolute;
      right:-35px;
      top:-35px;
      width:100px;
      height:100px;
      border-radius:50%;
      opacity:.12
    }

    .blue:after{background:#3b82f6}
    .purple:after{background:#8b5cf6}
    .green:after{background:#22c55e}
    .orange:after{background:#f59e0b}

    .summary-icon{
      width:50px;
      height:50px;
      flex-shrink:0;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:14px;
      font-size:22px
    }

    .blue .summary-icon{
      background:rgba(59,130,246,.12)
    }

    .purple .summary-icon{
      background:rgba(139,92,246,.12)
    }

    .green .summary-icon{
      background:rgba(34,197,94,.12)
    }

    .orange .summary-icon{
      background:rgba(245,158,11,.12)
    }

    .summary-card div:last-child{
      display:flex;
      flex-direction:column
    }

    .summary-card span{
      color:#94a3b8;
      font-size:11px
    }

    .summary-card strong{
      margin-top:3px;
      color:#f8fafc;
      font-size:25px;
      line-height:1.2
    }

    .summary-card small{
      margin-top:4px;
      color:#64748b;
      font-size:9px
    }

    .content-grid{
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:20px
    }

    .data-card{
      min-width:0;
      padding:0!important;
      overflow:hidden;
      border:1px solid rgba(148,163,184,.1);
      border-radius:17px!important;
      background:#111827!important;
      color:#e2e8f0;
      box-shadow:0 8px 25px rgba(0,0,0,.12)!important
    }

    .managers-card{
      grid-column:1/-1
    }

    .card-header{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:15px;
      padding:20px 21px 15px
    }

    .card-header h2{
      margin:0;
      color:#f8fafc;
      font-size:16px;
      font-weight:650
    }

    .card-header p{
      margin:5px 0 0;
      color:#64748b;
      font-size:10px
    }

    .count{
      min-width:30px;
      height:30px;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:0 9px;
      border-radius:9px;
      font-size:11px;
      font-weight:700
    }

    .blue-count{
      color:#93c5fd;
      background:rgba(59,130,246,.12)
    }

    .purple-count{
      color:#c4b5fd;
      background:rgba(139,92,246,.12)
    }

    .green-count{
      color:#86efac;
      background:rgba(34,197,94,.12)
    }

    .search-box{
      height:42px;
      display:flex;
      align-items:center;
      gap:9px;
      margin:0 20px 10px;
      padding:0 12px;
      border:1px solid #263449;
      border-radius:9px;
      background:#0b1324;
      transition:.2s
    }

    .search-box:focus-within{
      border-color:#3b82f6;
      box-shadow:0 0 0 3px rgba(59,130,246,.08)
    }

    .search-box span{
      font-size:13px;
      opacity:.7
    }

    .search-box input{
      width:100%;
      height:100%;
      border:0;
      outline:0;
      background:transparent;
      color:#f8fafc;
      font-size:12px
    }

    .search-box input::placeholder{
      color:#64748b
    }

    .data-list{
      padding:0 10px 10px
    }

    .data-row{
      min-height:67px;
      display:flex;
      align-items:center;
      gap:12px;
      padding:10px;
      border-radius:11px;
      transition:.2s
    }

    .data-row:hover{
      background:rgba(59,130,246,.06)
    }

    .row-icon{
      width:40px;
      height:40px;
      flex-shrink:0;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:10px;
      font-size:17px
    }

    .operator-icon{
      background:rgba(59,130,246,.11)
    }

    .user-icon{
      background:rgba(139,92,246,.11)
    }

    .manager-icon{
      background:rgba(34,197,94,.11)
    }

    .row-content{
      min-width:0;
      display:flex;
      flex-direction:column;
      gap:4px
    }

    .row-content strong{
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      color:#e2e8f0;
      font-size:12px
    }

    .row-content span{
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      color:#64748b;
      font-size:10px
    }

    .row-right{
      margin-left:auto;
      min-width:0;
      display:flex;
      flex-direction:column;
      align-items:flex-end;
      gap:5px
    }

    .email{
      max-width:180px;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      color:#64748b;
      font-size:9px
    }

    .active-badge,.role-badge,.manager-badge{
      padding:4px 7px;
      border-radius:5px;
      font-size:8px;
      font-weight:600;
      white-space:nowrap
    }

    .active-badge{
      color:#86efac;
      background:rgba(34,197,94,.1)
    }

    .role-badge{
      color:#c4b5fd;
      background:rgba(139,92,246,.1)
    }

    .manager-badge{
      color:#86efac;
      background:rgba(34,197,94,.1)
    }

    .empty-state{
      min-height:150px;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:6px;
      color:#64748b;
      text-align:center
    }

    .empty-state span{
      margin-bottom:4px;
      font-size:25px;
      opacity:.6
    }

    .empty-state strong{
      color:#94a3b8;
      font-size:12px
    }

    .empty-state small{
      font-size:9px
    }

    @media(max-width:1000px){
      .summary-grid{
        grid-template-columns:repeat(2,1fr)
      }

      .content-grid{
        grid-template-columns:1fr
      }

      .managers-card{
        grid-column:auto
      }
    }

    @media(max-width:650px){
      .page-shell{
        padding:18px 12px
      }

      .page-header{
        align-items:flex-start;
        flex-direction:column
      }

      .page-header h1{
        font-size:25px
      }

      .refresh-button{
        width:100%
      }

      .summary-grid{
        grid-template-columns:1fr
      }

      .data-row{
        align-items:flex-start
      }

      .row-right{
        display:none
      }
    }
  `]
})
export class OperatorsPage implements OnInit {
  operators: any[] = [];
  users: any[] = [];
  siteManagers: any[] = [];
  operatorSearch = '';
  userSearch = '';
  managerSearch = '';

  constructor(private readonly operatorService: OperatorService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.operatorService.getAllOperators().subscribe({
      next: data => this.operators = data || [],
      error: () => this.operators = []
    });

    this.operatorService.getAllUsers().subscribe({
      next: data => this.users = data || [],
      error: () => this.users = []
    });

    this.operatorService.getSiteManagers().subscribe({
      next: data => this.siteManagers = data || [],
      error: () => this.siteManagers = []
    });
  }

  get filteredOperators(): any[] {
    const search = this.operatorSearch.toLowerCase().trim();

    if (!search) return this.operators;

    return this.operators.filter(op =>
      `${op.name} ${op.code} ${op.contactEmail}`
        .toLowerCase()
        .includes(search)
    );
  }

  get filteredUsers(): any[] {
    const search = this.userSearch.toLowerCase().trim();

    if (!search) return this.users;

    return this.users.filter(user =>
      `${user.username || ''} ${user.email || ''} ${user.role || ''}`
        .toLowerCase()
        .includes(search)
    );
  }

  get filteredManagers(): any[] {
    const search = this.managerSearch.toLowerCase().trim();

    if (!search) return this.siteManagers;

    return this.siteManagers.filter(manager =>
      `${manager.username || ''} ${manager.email || ''} ${manager.role || ''}`
        .toLowerCase()
        .includes(search)
    );
  }
}