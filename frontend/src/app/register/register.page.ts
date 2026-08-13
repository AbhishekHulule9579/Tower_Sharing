import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { OperatorService } from '../services/operator.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule
  ],
  template: `
    <div class="register-shell">
      <div class="orb orb1"></div>
      <div class="orb orb2"></div>

      <div class="register-container">

        <section class="brand-section">
          <div class="brand-icon">📡</div>
          <div class="brand-name">Tower<span>Sync</span></div>
          <div class="line"></div>

          <h1>
            Join the TowerSync
            <span>Operations Platform</span>
          </h1>

          <p>
            Create your account and request access to manage telecom
            operations, tower sites and network activities.
          </p>

          <div class="features">
            <div>✓ Secure account registration</div>
            <div>✓ Operator and site management</div>
            <div>✓ Role-based platform access</div>
          </div>

          <div class="status">
            <span></span>
            Registration system ready
          </div>
        </section>

        <mat-card class="register-card">

          <div class="register-header">
            <div class="header-icon">📝</div>
            <div>
              <h2>Create Account</h2>
              <p>Submit your registration request</p>
            </div>
          </div>

          <div class="error" *ngIf="errorMessage">
            <span>⚠️</span>
            <span>{{ errorMessage }}</span>
            <button type="button" (click)="errorMessage=''">×</button>
          </div>

          <div class="success" *ngIf="successMessage">
            <span>✓</span>
            <span>{{ successMessage }}</span>
          </div>

          <form (ngSubmit)="submit()">

            <label>Register as</label>
            <div class="select-box">
              <span>
                {{ requestedRole === 'SITE_MANAGER' ? '👨‍💼' : '📡' }}
              </span>

              <select
                name="requestedRole"
                [(ngModel)]="requestedRole">

                <option value="SITE_MANAGER">
                  Site Manager
                </option>

                <option value="OPERATOR_MANAGER">
                  Operations Manager
                </option>

              </select>

              <span class="arrow">⌄</span>
            </div>

            <div class="role-info">
              <span>
                {{ requestedRole === 'SITE_MANAGER' ? '👨‍💼' : '📡' }}
              </span>

              <div>
                <small>REQUESTING ACCESS AS</small>
                <strong>
                  {{
                    requestedRole === 'SITE_MANAGER'
                      ? 'Site Manager'
                      : 'Operations Manager'
                  }}
                </strong>
              </div>
            </div>

            <label>Username</label>
            <div class="input-box">
              <span>👤</span>
              <input
                name="username"
                type="text"
                autocomplete="username"
                placeholder="Choose a username"
                required
                [(ngModel)]="username">
            </div>

            <label>Full Name</label>
            <div class="input-box">
              <span>🧑</span>
              <input
                name="fullName"
                type="text"
                autocomplete="name"
                placeholder="Enter your full name"
                required
                [(ngModel)]="fullName">
            </div>

            <label>Email</label>
            <div class="input-box">
              <span>✉️</span>
              <input
                name="email"
                type="email"
                autocomplete="email"
                placeholder="Enter your email address"
                required
                [(ngModel)]="email">
            </div>

            <label>Phone Number</label>
            <div class="input-box">
              <span>📱</span>
              <input
                name="phoneNumber"
                type="tel"
                autocomplete="tel"
                placeholder="Enter your phone number"
                required
                [(ngModel)]="phoneNumber">
            </div>

            <label>Password</label>
            <div class="input-box">
              <span>🔒</span>

              <input
                name="password"
                [type]="hidePassword ? 'password' : 'text'"
                autocomplete="new-password"
                placeholder="Create a password"
                required
                [(ngModel)]="password">

              <button
                type="button"
                class="eye"
                (click)="hidePassword=!hidePassword">

                {{ hidePassword ? '👁' : '🙈' }}

              </button>
            </div>

            <label>Operator</label>
            <div class="select-box">

              <span>🏢</span>

              <select
                name="operatorId"
                [(ngModel)]="operatorId"
                [disabled]="isOperatorsLoading || operators.length === 0">

                <option [ngValue]="null" disabled>
                  {{ isOperatorsLoading ? 'Loading telecom operators...' : 'Select your operator' }}
                </option>

                <option
                  *ngFor="let op of operators"
                  [ngValue]="op.id">

                  {{ op.name }} ({{ op.code }})

                </option>

              </select>

              <span class="arrow">⌄</span>

            </div>

            <div class="operator-load-message" *ngIf="isOperatorsLoading">
              Loading available telecom operators…
            </div>

            <div class="operator-load-message error" *ngIf="operatorsLoadError">
              <span>{{ operatorsLoadError }}</span>
              <button type="button" (click)="loadOperators()">Try again</button>
            </div>

            <div
              class="operator-info"
              *ngIf="operatorId !== null">

              <span>🏢</span>

              <div>
                <small>SELECTED OPERATOR</small>

                <strong>
                  {{ selectedOperatorName }}
                </strong>
              </div>

            </div>

            <button
              mat-flat-button
              type="submit"
              class="submit-button"
              [disabled]="isLoading">

              <span *ngIf="!isLoading">
                📝 &nbsp; Submit Registration Request
              </span>

              <span *ngIf="isLoading">
                <i></i>
                Submitting...
              </span>

            </button>

            <button
              mat-button
              type="button"
              class="back-button"
              routerLink="/login">

              ← Back to Login

            </button>

          </form>

          <div class="security">
            🔒 Your registration information is securely submitted
          </div>

        </mat-card>
      </div>
    </div>
  `,

  styles: [`
    *{box-sizing:border-box}

    .register-shell{
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

    .register-container{
      width:min(1080px,100%);
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
      padding:48px 45px;
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
      font-size:29px;
      line-height:1.2;
      color:#f8fafc
    }

    .brand-section h1 span{
      display:block;
      margin-top:4px;
      color:#a78bfa
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
      margin-bottom:28px;
      color:#cbd5e1;
      font-size:13px
    }

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

    .register-card{
      padding:38px 42px;
      border-radius:0!important;
      background:#0f172a!important;
      box-shadow:none!important;
      color:#fff
    }

    .register-header{
      display:flex;
      align-items:center;
      gap:14px;
      margin-bottom:25px
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

    .register-header h2{
      margin:0;
      color:#f8fafc;
      font-size:27px
    }

    .register-header p{
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
      height:52px;
      display:flex;
      align-items:center;
      gap:10px;
      padding:0 15px;
      margin-bottom:15px;
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

    .input-box input::placeholder{
      color:#64748b
    }

    .eye{
      border:0;
      background:transparent;
      color:#94a3b8;
      cursor:pointer;
      font-size:16px;
      padding:5px
    }

    .eye:hover{
      color:#60a5fa
    }

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

    .select-box select option{
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

    .role-info,.operator-info{
      display:flex;
      align-items:center;
      gap:11px;
      margin:-2px 0 17px;
      padding:10px 13px;
      border-radius:11px;
      background:rgba(59,130,246,.07);
      border:1px solid rgba(96,165,250,.10)
    }

    .operator-load-message{
      display:flex;
      align-items:center;
      gap:10px;
      margin:-4px 0 17px;
      color:#94a3b8;
      font-size:12px
    }

    .operator-load-message.error{
      margin-top:-4px;
      padding:10px 12px
    }

    .operator-load-message button{
      margin-left:auto;
      border:0;
      border-radius:6px;
      padding:5px 8px;
      background:rgba(248,113,113,.15);
      color:#fecaca;
      cursor:pointer
    }

    .role-info>span,.operator-info>span{
      width:34px;
      height:34px;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:9px;
      background:rgba(59,130,246,.13)
    }

    .role-info div,.operator-info div{
      display:flex;
      flex-direction:column;
      gap:2px
    }

    .role-info small,.operator-info small{
      color:#64748b;
      font-size:8px;
      letter-spacing:.7px
    }

    .role-info strong,.operator-info strong{
      color:#cbd5e1;
      font-size:11px
    }

    .submit-button{
      width:100%;
      height:52px;
      margin-top:2px;
      border-radius:11px!important;
      color:#fff!important;
      font-size:14px;
      font-weight:700;
      background:linear-gradient(135deg,#2563eb,#7c3aed)!important;
      box-shadow:0 10px 25px rgba(37,99,235,.22);
      transition:.2s
    }

    .submit-button:hover:not(:disabled){
      transform:translateY(-2px);
      box-shadow:0 15px 32px rgba(124,58,237,.3)
    }

    .submit-button:disabled{
      opacity:.65
    }

    .submit-button i{
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

    @keyframes spin{
      to{transform:rotate(360deg)}
    }

    .back-button{
      width:100%;
      height:42px;
      margin-top:8px;
      color:#94a3b8!important;
      font-size:12px
    }

    .back-button:hover{
      color:#60a5fa!important;
      background:rgba(59,130,246,.07)
    }

    .error,.success{
      display:flex;
      align-items:center;
      gap:8px;
      padding:11px 12px;
      margin-bottom:17px;
      border-radius:10px;
      font-size:12px
    }

    .error{
      background:rgba(239,68,68,.08);
      border:1px solid rgba(248,113,113,.18);
      color:#fca5a5
    }

    .success{
      background:rgba(34,197,94,.08);
      border:1px solid rgba(74,222,128,.18);
      color:#86efac
    }

    .error button{
      margin-left:auto;
      border:0;
      background:transparent;
      color:#fca5a5;
      font-size:18px;
      cursor:pointer
    }

    .security{
      margin-top:17px;
      text-align:center;
      color:#475569;
      font-size:9px
    }

    @media(max-width:850px){
      .register-container{
        grid-template-columns:1fr;
        max-width:580px
      }

      .brand-section{
        display:none
      }

      .register-card{
        border-radius:26px!important
      }
    }

    @media(max-width:600px){
      .register-shell{
        padding:20px 12px;
        min-height:100vh
      }

      .register-card{
        padding:28px 20px
      }

      .register-header h2{
        font-size:24px
      }
    }
  `]
})
export class RegisterPage implements OnInit {
  username = '';
  fullName = '';
  email = '';
  phoneNumber = '';
  requestedRole = 'SITE_MANAGER';
  password = '';
  operatorId: number | null = null;
  errorMessage = '';
  successMessage = '';
  operators: any[] = [];
  isOperatorsLoading = false;
  operatorsLoadError = '';
  hidePassword = true;
  isLoading = false;

  constructor(
    private readonly authService: AuthService,
    private readonly operatorService: OperatorService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadOperators();
  }

  loadOperators(): void {
    this.isOperatorsLoading = true;
    this.operatorsLoadError = '';

    this.operatorService.getAllOperators().subscribe({
      next: data => {
        this.operators = (data || []).filter(operator => operator.active !== false);
        this.isOperatorsLoading = false;

        if (this.operators.length === 0) {
          this.operatorsLoadError = 'No telecom operators are currently available.';
        }
      },
      error: () => {
        this.operators = [];
        this.isOperatorsLoading = false;
        this.operatorsLoadError = 'Unable to load telecom operators. Please try again.';
      }
    });
  }

  get selectedOperatorName(): string {
    const operator = this.operators.find(op => op.id === this.operatorId);
    return operator
      ? `${operator.name} (${operator.code})`
      : 'Operator selected';
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.username.trim() ||
      !this.fullName.trim() ||
      !this.email.trim() ||
      !this.phoneNumber.trim() ||
      !this.password ||
      this.operatorId === null
    ) {
      this.errorMessage = 'Please complete all fields to submit your request.';
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;

    this.authService.registerSiteManagerRequest({
      username: this.username.trim(),
      password: this.password,
      email: this.email.trim(),
      fullName: this.fullName.trim(),
      phoneNumber: this.phoneNumber.trim(),
      operatorId: this.operatorId,
      requestedRole: this.requestedRole
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage =
          this.requestedRole === 'SITE_MANAGER'
            ? 'Request submitted. Your Operations Manager will review it.'
            : 'Request submitted. The Platform Administrator will review it.';

        setTimeout(() => this.router.navigate(['/login']), 1800);
      },
      error: error => {
        this.isLoading = false;
        this.errorMessage =
          typeof error?.error === 'string'
            ? error.error
            : 'Unable to submit registration request at this time.';
      }
    });
  }
}
