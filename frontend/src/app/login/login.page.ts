import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatButtonModule],
  template: `
    <div class="login-shell">
      <div class="orb orb1"></div>
      <div class="orb orb2"></div>

      <div class="login-container">
        <section class="brand-section">
          <div class="brand-icon">📡</div>
          <div class="brand-name">Tower<span>Sync</span></div>
          <div class="line"></div>
          <h1>Telecom Operations <span>Management Platform</span></h1>
          <p>Securely manage tower operations, operators, site managers and disaster recovery from one powerful platform.</p>

          <div class="features">
            <div>✓ Real-time tower monitoring</div>
            <div>✓ Operator & site management</div>
            <div>✓ Disaster recovery operations</div>
          </div>

          <div class="status">
            <span></span>
            TowerSync services ready
          </div>
        </section>

        <mat-card class="login-card">
          <div class="login-header">
            <div class="header-icon">📡</div>
            <div>
              <h2>Welcome Back</h2>
              <p>Sign in to your TowerSync account</p>
            </div>
          </div>

          <div class="error" *ngIf="errorMessage">
            <span>⚠️</span>
            <span>{{ errorMessage }}</span>
            <button type="button" (click)="errorMessage=''">×</button>
          </div>

          <form (ngSubmit)="login()">
            <label>Username</label>
            <div class="input-box">
              <span>👤</span>
              <input
                name="username"
                type="text"
                autocomplete="username"
                placeholder="Enter your username"
                required
                [(ngModel)]="username">
            </div>

            <label>Password</label>
            <div class="input-box">
              <span>🔒</span>
              <input
                name="password"
                [type]="hidePassword ? 'password' : 'text'"
                autocomplete="current-password"
                placeholder="Enter your password"
                required
                [(ngModel)]="password">

              <button
                type="button"
                class="eye"
                (click)="hidePassword=!hidePassword">

                {{ hidePassword ? '👁' : '🙈' }}
              </button>
            </div>

            <label>Login as</label>
            <div class="select-box">
              <span>
                {{ role === 'ADMIN' ? '🛡️' : role === 'OPERATOR_MANAGER' ? '📡' : '👨‍💼' }}
              </span>

              <select name="role" [(ngModel)]="role">
                <option value="ADMIN">Administrator</option>
                <option value="OPERATOR_MANAGER">Operator Manager</option>
                <option value="SITE_MANAGER">Site Manager</option>
              </select>

              <span class="arrow">⌄</span>
            </div>

            <div class="selected-role">
              <div class="role-icon">
                {{ role === 'ADMIN' ? '🛡️' : role === 'OPERATOR_MANAGER' ? '📡' : '👨‍💼' }}
              </div>
              <div>
                <small>SIGNING IN AS</small>
                <strong>
                  {{ role === 'ADMIN' ? 'Administrator' : role === 'OPERATOR_MANAGER' ? 'Operator Manager' : 'Site Manager' }}
                </strong>
              </div>
            </div>

            <button
              mat-flat-button
              type="submit"
              class="login-button"
              [disabled]="isLoading">

              <span *ngIf="!isLoading">🔐 &nbsp; Sign In</span>

              <span *ngIf="isLoading">
                <i></i> Signing in...
              </span>
            </button>
          </form>

          <div class="register">
            <span>Don't have an account?</span>
            <button mat-button type="button" routerLink="/register">
              Register as Site Manager or Operations Manager →
            </button>
          </div>

          <div class="security">
            🔒 Secure TowerSync authentication
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    *{box-sizing:border-box}

    .login-shell{
      min-height:calc(100vh - 64px);
      display:flex;
      align-items:center;
      justify-content:center;
      padding:35px 20px;
      position:relative;
      overflow:hidden;
      background:
        radial-gradient(circle at 10% 20%,rgba(37,99,235,.18),transparent 30%),
        radial-gradient(circle at 90% 20%,rgba(124,58,237,.18),transparent 30%),
        #070d1a
    }

    .orb{
      position:absolute;
      border-radius:50%;
      filter:blur(70px);
      opacity:.18;
      pointer-events:none
    }

    .orb1{
      width:250px;
      height:250px;
      background:#2563eb;
      left:-100px;
      top:10%
    }

    .orb2{
      width:280px;
      height:280px;
      background:#9333ea;
      right:-100px;
      bottom:10%
    }

    .login-container{
      width:min(1050px,100%);
      display:grid;
      grid-template-columns:.9fr 1.1fr;
      position:relative;
      z-index:1;
      border:1px solid rgba(148,163,184,.13);
      border-radius:26px;
      overflow:hidden;
      background:rgba(15,23,42,.9);
      box-shadow:0 30px 80px rgba(0,0,0,.4)
    }

    .brand-section{
      padding:50px 45px;
      background:linear-gradient(145deg,rgba(37,99,235,.2),rgba(124,58,237,.12))
    }

    .brand-icon{
      width:62px;
      height:62px;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:17px;
      font-size:29px;
      background:linear-gradient(135deg,#2563eb,#7c3aed);
      margin-bottom:17px
    }

    .brand-name{
      font-size:31px;
      font-weight:800;
      color:#f8fafc
    }

    .brand-name span{color:#60a5fa}

    .line{
      width:55px;
      height:3px;
      margin:15px 0 24px;
      border-radius:5px;
      background:linear-gradient(90deg,#60a5fa,#a78bfa)
    }

    .brand-section h1{
      margin:0;
      font-size:30px;
      line-height:1.2;
      color:#f8fafc
    }

    .brand-section h1 span{
      display:block;
      color:#a78bfa;
      margin-top:4px
    }

    .brand-section p{
      margin:20px 0 25px;
      color:#a8b5c7;
      font-size:14px;
      line-height:1.7
    }

    .features{
      display:grid;
      gap:13px;
      color:#cbd5e1;
      font-size:13px;
      margin-bottom:28px
    }

    .features div:first-letter{color:#4ade80}

    .status{
      width:max-content;
      display:flex;
      align-items:center;
      gap:8px;
      padding:9px 13px;
      border-radius:20px;
      color:#86efac;
      font-size:11px;
      background:rgba(34,197,94,.08);
      border:1px solid rgba(34,197,94,.16)
    }

    .status span{
      width:7px;
      height:7px;
      border-radius:50%;
      background:#22c55e;
      box-shadow:0 0 10px #22c55e
    }

    .login-card{
      padding:42px;
      border-radius:0!important;
      background:#0f172a!important;
      box-shadow:none!important;
      color:#fff
    }

    .login-header{
      display:flex;
      align-items:center;
      gap:14px;
      margin-bottom:28px
    }

    .header-icon{
      width:48px;
      height:48px;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:14px;
      background:rgba(59,130,246,.15);
      font-size:22px
    }

    .login-header h2{
      margin:0;
      color:#f8fafc;
      font-size:28px
    }

    .login-header p{
      margin:5px 0 0;
      color:#94a3b8;
      font-size:13px
    }

    form{
      display:flex;
      flex-direction:column
    }

    label{
      margin:0 0 7px;
      color:#cbd5e1;
      font-size:12px;
      font-weight:600
    }

    .input-box,.select-box{
      width:100%;
      height:54px;
      display:flex;
      align-items:center;
      gap:10px;
      padding:0 15px;
      margin-bottom:18px;
      border:1px solid #334155;
      border-radius:10px;
      background:#0b1324;
      transition:.2s
    }

    .input-box:focus-within,.select-box:focus-within{
      border-color:#60a5fa;
      box-shadow:0 0 0 3px rgba(59,130,246,.1)
    }

    .input-box>span,.select-box>span{
      flex-shrink:0;
      font-size:16px
    }

    .input-box input{
      width:100%;
      height:100%;
      border:0;
      outline:0;
      background:transparent;
      color:#f8fafc;
      font-size:14px
    }

    .input-box input::placeholder{color:#64748b}

    .eye{
      border:0;
      background:transparent;
      color:#94a3b8;
      cursor:pointer;
      font-size:16px;
      padding:5px
    }

    .eye:hover{color:#60a5fa}

    .select-box{
      position:relative;
      padding-right:40px
    }

    .select-box select{
      width:100%;
      height:100%;
      border:0;
      outline:0;
      background:transparent;
      color:#f8fafc;
      font-size:14px;
      cursor:pointer;
      appearance:none
    }

    .select-box option{
      background:#111827;
      color:#f8fafc;
      padding:12px
    }

    .arrow{
      position:absolute;
      right:15px;
      pointer-events:none;
      color:#94a3b8;
      font-size:18px
    }

    .selected-role{
      display:flex;
      align-items:center;
      gap:12px;
      margin:-2px 0 22px;
      padding:11px 13px;
      border:1px solid rgba(96,165,250,.12);
      border-radius:12px;
      background:rgba(59,130,246,.07)
    }

    .role-icon{
      width:36px;
      height:36px;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:9px;
      background:rgba(59,130,246,.13)
    }

    .selected-role div:last-child{
      display:flex;
      flex-direction:column;
      gap:3px
    }

    .selected-role small{
      color:#64748b;
      font-size:9px;
      letter-spacing:.7px
    }

    .selected-role strong{
      color:#e2e8f0;
      font-size:12px
    }

    .login-button{
      width:100%;
      height:54px;
      border-radius:12px!important;
      color:#fff!important;
      font-size:15px;
      font-weight:700;
      background:linear-gradient(135deg,#2563eb,#7c3aed)!important;
      box-shadow:0 10px 28px rgba(37,99,235,.25);
      transition:.2s
    }

    .login-button:hover:not(:disabled){
      transform:translateY(-2px);
      box-shadow:0 15px 35px rgba(124,58,237,.3)
    }

    .login-button:disabled{opacity:.65}

    .login-button i{
      display:inline-block;
      width:16px;
      height:16px;
      margin-right:7px;
      vertical-align:middle;
      border:2px solid rgba(255,255,255,.35);
      border-top-color:#fff;
      border-radius:50%;
      animation:spin .7s linear infinite
    }

    @keyframes spin{to{transform:rotate(360deg)}}

    .error{
      display:flex;
      align-items:center;
      gap:8px;
      padding:11px 12px;
      margin-bottom:18px;
      border-radius:10px;
      background:rgba(239,68,68,.08);
      border:1px solid rgba(248,113,113,.18);
      color:#fca5a5;
      font-size:12px
    }

    .error button{
      margin-left:auto;
      border:0;
      background:transparent;
      color:#fca5a5;
      font-size:18px;
      cursor:pointer
    }

    .register{
      display:flex;
      flex-direction:column;
      align-items:center;
      margin-top:23px;
      padding-top:19px;
      border-top:1px solid rgba(148,163,184,.08)
    }

    .register>span{
      color:#64748b;
      font-size:11px
    }

    .register button{
      color:#60a5fa!important;
      font-size:11px
    }

    .security{
      margin-top:12px;
      text-align:center;
      color:#475569;
      font-size:9px
    }

    @media(max-width:850px){
      .login-container{grid-template-columns:1fr;max-width:560px}
      .brand-section{display:none}
      .login-card{border-radius:26px!important}
    }

    @media(max-width:600px){
      .login-shell{padding:20px 12px;min-height:100vh}
      .login-card{padding:28px 20px}
      .login-header h2{font-size:24px}
    }
  `]
})
export class LoginPage {
  username = '';
  password = '';
  role = 'ADMIN';
  errorMessage = '';
  hidePassword = true;
  isLoading = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  login(): void {
    this.errorMessage = '';

    if (!this.username.trim() || !this.password) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;

    this.authService.login(
      this.username.trim(),
      this.password,
      this.role
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          typeof error?.error === 'string'
            ? error.error
            : 'Login failed. Please check your credentials and selected role.';
      }
    });
  }
}