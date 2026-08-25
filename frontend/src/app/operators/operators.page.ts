import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService, AuthUser } from '../services/auth.service';
import { OperatorService } from '../services/operator.service';

@Component({
  standalone: true,
  selector: 'app-operators',
  imports: [CommonModule, FormsModule, MatCardModule, MatDividerModule],
  templateUrl: './operators.page.html',
  styleUrls: ['./operators.page.css']
})
export class OperatorsPage implements OnInit {
  currentUser: AuthUser | null = null;
  isAdmin = false;

  operators: any[] = [];
  users: any[] = [];
  siteManagers: any[] = [];
  operatorSearch = '';
  userSearch = '';
  managerSearch = '';

  constructor(
    private readonly operatorService: OperatorService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.currentUser?.role === 'ADMIN';
    this.loadData();
  }

  loadData(): void {
    this.operatorService.getAllOperators().subscribe({
      next: (data) => (this.operators = data || []),
      error: () => (this.operators = [])
    });

    this.operatorService.getAllUsers().subscribe({
      next: (data) => (this.users = data || []),
      error: () => (this.users = [])
    });

    this.operatorService.getSiteManagers().subscribe({
      next: (data) => (this.siteManagers = data || []),
      error: () => (this.siteManagers = [])
    });
  }

  get operatorName(): string {
    return this.currentUser?.operatorName || 'Company';
  }

  // Admin view: strictly Operator Managers belonging to their operator
  get adminOperatorManagers(): any[] {
    const search = this.managerSearch.toLowerCase().trim();
    let list = this.users.filter(
      (u) =>
        u.role === 'OPERATOR_MANAGER' &&
        (!this.currentUser?.operatorId || u.operator?.id === this.currentUser?.operatorId || !u.operator)
    );

    if (!search) return list;

    return list.filter((m) =>
      `${m.fullName || ''} ${m.name || ''} ${m.username || ''} ${m.email || ''} ${m.phoneNumber || ''}`
        .toLowerCase()
        .includes(search)
    );
  }

  // Admin view: all team members under this operator
  get adminCompanyStaff(): any[] {
    const search = this.userSearch.toLowerCase().trim();
    let list = this.users.filter(
      (u) =>
        !this.currentUser?.operatorId ||
        u.operator?.id === this.currentUser?.operatorId
    );

    if (!search) return list;

    return list.filter((u) =>
      `${u.fullName || ''} ${u.name || ''} ${u.username || ''} ${u.email || ''} ${u.phoneNumber || ''} ${u.role || ''}`
        .toLowerCase()
        .includes(search)
    );
  }

  get filteredOperators(): any[] {
    const search = this.operatorSearch.toLowerCase().trim();
    if (!search) return this.operators;
    return this.operators.filter((op) =>
      `${op.name} ${op.code} ${op.contactEmail}`.toLowerCase().includes(search)
    );
  }

  get filteredUsers(): any[] {
    const search = this.userSearch.toLowerCase().trim();
    if (!search) return this.users;
    return this.users.filter((user) =>
      `${user.fullName || ''} ${user.name || ''} ${user.username || ''} ${user.email || ''} ${user.role || ''}`
        .toLowerCase()
        .includes(search)
    );
  }

  get filteredManagers(): any[] {
    const search = this.managerSearch.toLowerCase().trim();
    if (!search) return this.siteManagers;
    return this.siteManagers.filter((manager) =>
      `${manager.fullName || ''} ${manager.name || ''} ${manager.username || ''} ${manager.email || ''} ${manager.role || ''}`
        .toLowerCase()
        .includes(search)
    );
  }
}