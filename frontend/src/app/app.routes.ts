import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { DashboardPage } from './dashboard/dashboard.page';
import { DisastersPage } from './disasters/disasters.page';
import { HomePage } from './home/home.page';
import { LeasesPage } from './leases/leases.page';
import { LoginPage } from './login/login.page';
import { MaintenancePage } from './maintenance/maintenance.page';
import { OperatorsPage } from './operators/operators.page';
import { RegisterPage } from './register/register.page';
import { NotFoundPage } from './shared/not-found.page';
import { SiteManagerRequestsPage } from './site-manager-requests/site-manager-requests.page';
import { TowersPage } from './towers/towers.page';
import { TransactionsPage } from './transactions/transactions.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'dashboard', component: DashboardPage, canActivate: [AuthGuard] },
  { path: 'towers', component: TowersPage, canActivate: [AuthGuard] },
  { path: 'leases', component: LeasesPage, canActivate: [AuthGuard] },
  { path: 'transactions', component: TransactionsPage, canActivate: [AuthGuard] },
  { path: 'disasters', component: DisastersPage, canActivate: [AuthGuard] },
  { path: 'maintenance', component: MaintenancePage, canActivate: [AuthGuard] },
  { path: 'operators', component: OperatorsPage, canActivate: [AuthGuard] },
  { path: 'site-manager-requests', component: SiteManagerRequestsPage, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundPage }
];
