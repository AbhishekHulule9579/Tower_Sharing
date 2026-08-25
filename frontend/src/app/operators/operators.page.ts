import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { OperatorService } from '../services/operator.service';

@Component({
  standalone: true,
  selector: 'app-operators',
  imports: [CommonModule, FormsModule, MatCardModule],
  templateUrl: './operators.page.html',
  styleUrls: ['./operators.page.css']
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
      `${user.fullName || ''} ${user.name || ''} ${user.username || ''} ${user.email || ''} ${user.role || ''}`
        .toLowerCase()
        .includes(search)
    );
  }

  get filteredManagers(): any[] {
    const search = this.managerSearch.toLowerCase().trim();

    if (!search) return this.siteManagers;

    return this.siteManagers.filter(manager =>
      `${manager.fullName || ''} ${manager.name || ''} ${manager.username || ''} ${manager.email || ''} ${manager.role || ''}`
        .toLowerCase()
        .includes(search)
    );
  }
}