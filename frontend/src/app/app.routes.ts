import { Routes } from '@angular/router';
import { DashboardPage } from './dashboard/dashboard.page';
import { DisastersPage } from './disasters/disasters.page';
import { LeasesPage } from './leases/leases.page';
import { MaintenancePage } from './maintenance/maintenance.page';
import { OperatorsPage } from './operators/operators.page';
import { NotFoundPage } from './shared/not-found.page';
import { TowersPage } from './towers/towers.page';
import { TransactionsPage } from './transactions/transactions.page';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardPage },
  { path: 'towers', component: TowersPage },
  { path: 'leases', component: LeasesPage },
  { path: 'transactions', component: TransactionsPage },
  { path: 'disasters', component: DisastersPage },
  { path: 'maintenance', component: MaintenancePage },
  { path: 'operators', component: OperatorsPage },
  { path: '**', component: NotFoundPage }
];
