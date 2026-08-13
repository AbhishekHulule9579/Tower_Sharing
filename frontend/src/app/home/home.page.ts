import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule
  ],
  template: `
    <div class="home-shell">

      <!-- Animated Background -->
      <div class="background-shape shape-one"></div>
      <div class="background-shape shape-two"></div>
      <div class="background-shape shape-three"></div>

      <!-- HERO SECTION -->
      <section class="hero-section">

        <div class="hero-content">

          <div class="welcome-badge">
            <span class="pulse-dot"></span>
            Telecom Operations Platform
          </div>

          <h1>
            Welcome to
            <span class="gradient-text">TowerSync</span>
          </h1>

          <p class="hero-description">
            Manage telecom towers, operators, site managers,
            maintenance activities and disaster recovery
            from one powerful platform.
          </p>

          <div class="hero-actions">

            <button
              mat-flat-button
              class="primary-button"
              (click)="navigateTo('dashboard')">

              🚀 Go to Dashboard

            </button>

            <button
              mat-stroked-button
              class="secondary-button"
              (click)="navigateTo('login')">

              🔐 Login

            </button>

          </div>

          <div class="hero-info">
            <div>
              <strong>24/7</strong>
              <span>Monitoring</span>
            </div>

            <div>
              <strong>99.9%</strong>
              <span>Availability</span>
            </div>

            <div>
              <strong>Real-Time</strong>
              <span>Operations</span>
            </div>
          </div>

        </div>

        <!-- HERO VISUAL -->
        <div class="hero-visual">

          <div class="tower-container">

            <div class="tower-glow"></div>

            <div class="tower">
              <div class="tower-top">📡</div>

              <div class="tower-line line-one"></div>
              <div class="tower-line line-two"></div>
              <div class="tower-line line-three"></div>

              <div class="tower-base"></div>
            </div>

            <div class="signal signal-one"></div>
            <div class="signal signal-two"></div>
            <div class="signal signal-three"></div>

          </div>

        </div>

      </section>


      <!-- STATISTICS -->
      <section class="stats-section">

        <div class="stat-card">

          <div class="stat-icon blue">
            📡
          </div>

          <div>
            <span class="stat-number">500+</span>
            <span class="stat-label">Tower Sites</span>
          </div>

        </div>

        <div class="stat-card">

          <div class="stat-icon purple">
            👨‍💼
          </div>

          <div>
            <span class="stat-number">120+</span>
            <span class="stat-label">Site Managers</span>
          </div>

        </div>

        <div class="stat-card">

          <div class="stat-icon green">
            🟢
          </div>

          <div>
            <span class="stat-number">98%</span>
            <span class="stat-label">Active Towers</span>
          </div>

        </div>

        <div class="stat-card">

          <div class="stat-icon orange">
            ⚡
          </div>

          <div>
            <span class="stat-number">24/7</span>
            <span class="stat-label">System Monitoring</span>
          </div>

        </div>

      </section>


      <!-- FEATURES -->
      <section class="features-section">

        <div class="section-heading">

          <span class="section-label">
            PLATFORM FEATURES
          </span>

          <h2>
            Everything you need to
            <span class="gradient-text">manage operations</span>
          </h2>

          <p>
            Access important telecom operations from a single,
            intuitive platform.
          </p>

        </div>


        <div class="home-cards">

          <!-- Dashboard -->
          <mat-card
            class="feature-card dashboard-card"
            (click)="navigateTo('dashboard')">

            <div class="card-top">

              <div class="feature-icon dashboard-icon">
                📊
              </div>

              <span class="arrow">
                →
              </span>

            </div>

            <h2>Dashboard</h2>

            <p>
              Monitor operations, maintenance alerts,
              tower performance and request pipelines
              from one centralized dashboard.
            </p>

            <div class="card-footer">
              <span>View Dashboard</span>
              <span>→</span>
            </div>

          </mat-card>


          <!-- Operators -->
          <mat-card
            class="feature-card operators-card"
            (click)="navigateTo('operators')">

            <div class="card-top">

              <div class="feature-icon operator-icon">
                📡
              </div>

              <span class="arrow">
                →
              </span>

            </div>

            <h2>Operator Coverage</h2>

            <p>
              View telecom operators, site managers,
              tower assignments and network coverage
              information.
            </p>

            <div class="card-footer">
              <span>Explore Operators</span>
              <span>→</span>
            </div>

          </mat-card>


          <!-- Site Manager -->
          <mat-card
            class="feature-card manager-card"
            (click)="navigateTo('site-manager-requests')">

            <div class="card-top">

              <div class="feature-icon manager-icon">
                👨‍💼
              </div>

              <span class="arrow">
                →
              </span>

            </div>

            <h2>Site Manager Requests</h2>

            <p>
              Review, approve and manage site manager
              registration requests efficiently.
            </p>

            <div class="card-footer">
              <span>Manage Requests</span>
              <span>→</span>
            </div>

          </mat-card>

        </div>

      </section>


      <!-- QUICK ACTIONS -->
      <section class="quick-section">

        <div class="quick-content">

          <div>
            <span class="section-label">
              QUICK ACCESS
            </span>

            <h2>
              Ready to manage your towers?
            </h2>

            <p>
              Access your operations dashboard and start
              managing your telecom infrastructure.
            </p>
          </div>

          <button
            mat-flat-button
            class="quick-button"
            (click)="navigateTo('dashboard')">

            Open Dashboard →
            
          </button>

        </div>

      </section>


      <!-- FOOTER -->
      <footer class="home-footer">

        <div>
          <strong>Tower<span>Sync</span></strong>
          <p>
            Smart Telecom Tower Management
          </p>
        </div>

        <div class="footer-status">
          <span class="status-dot"></span>
          All systems operational
        </div>

      </footer>

    </div>
  `,

  styles: [`

    * {
      box-sizing: border-box;
    }

    .home-shell {
      position: relative;
      min-height: 100vh;
      overflow: hidden;
      padding: 35px;
      color: #f8fafc;
      background:
        radial-gradient(
          circle at 10% 20%,
          rgba(59, 130, 246, 0.22),
          transparent 30%
        ),
        radial-gradient(
          circle at 90% 10%,
          rgba(168, 85, 247, 0.20),
          transparent 30%
        ),
        radial-gradient(
          circle at 50% 90%,
          rgba(16, 185, 129, 0.14),
          transparent 35%
        ),
        #07111f;
    }


    /* =========================
       BACKGROUND SHAPES
       ========================= */

    .background-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(70px);
      opacity: 0.35;
      pointer-events: none;
      animation: float 8s ease-in-out infinite;
    }

    .shape-one {
      width: 250px;
      height: 250px;
      background: #2563eb;
      top: 5%;
      left: -100px;
    }

    .shape-two {
      width: 300px;
      height: 300px;
      background: #9333ea;
      right: -120px;
      top: 35%;
      animation-delay: 2s;
    }

    .shape-three {
      width: 220px;
      height: 220px;
      background: #10b981;
      bottom: -100px;
      left: 45%;
      animation-delay: 4s;
    }

    @keyframes float {

      0%,
      100% {
        transform: translateY(0);
      }

      50% {
        transform: translateY(-25px);
      }
    }


    /* =========================
       HERO
       ========================= */

    .hero-section {
      position: relative;
      z-index: 1;

      max-width: 1250px;
      margin: auto;

      min-height: 500px;

      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      align-items: center;
      gap: 40px;

      padding: 50px 30px;
    }

    .welcome-badge {
      display: inline-flex;
      align-items: center;
      gap: 9px;

      padding: 8px 14px;

      border-radius: 30px;

      background: rgba(59, 130, 246, 0.12);
      border: 1px solid rgba(96, 165, 250, 0.3);

      color: #93c5fd;

      font-size: 13px;
      font-weight: 600;

      margin-bottom: 20px;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;

      background: #22c55e;
      border-radius: 50%;

      box-shadow: 0 0 12px #22c55e;

      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {

      0% {
        transform: scale(1);
        opacity: 1;
      }

      50% {
        transform: scale(1.5);
        opacity: 0.5;
      }

      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    .hero-content h1 {
      margin: 0;

      font-size: clamp(2.8rem, 6vw, 5.5rem);

      line-height: 1.05;

      font-weight: 800;

      letter-spacing: -2px;
    }

    .gradient-text {
      background:
        linear-gradient(
          90deg,
          #60a5fa,
          #a78bfa,
          #f472b6
        );

      -webkit-background-clip: text;
      background-clip: text;

      color: transparent;
    }

    .hero-description {
      max-width: 700px;

      margin: 24px 0;

      font-size: 18px;

      line-height: 1.7;

      color: #b7c4d6;
    }


    /* =========================
       BUTTONS
       ========================= */

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;

      margin-top: 30px;
    }

    .primary-button {
      min-height: 48px;

      padding: 0 25px;

      border-radius: 12px !important;

      color: white !important;

      background:
        linear-gradient(
          135deg,
          #2563eb,
          #7c3aed
        ) !important;

      box-shadow:
        0 10px 25px rgba(37, 99, 235, 0.3);

      transition: 0.25s ease;
    }

    .primary-button:hover {
      transform: translateY(-3px);

      box-shadow:
        0 15px 35px rgba(124, 58, 237, 0.45);
    }

    .secondary-button {
      min-height: 48px;

      padding: 0 25px;

      border-radius: 12px !important;

      color: #bfdbfe !important;

      border-color: rgba(96, 165, 250, 0.5) !important;
    }

    .secondary-button:hover {
      background: rgba(59, 130, 246, 0.12);
    }


    /* =========================
       HERO INFO
       ========================= */

    .hero-info {
      display: flex;
      gap: 40px;

      margin-top: 40px;
    }

    .hero-info div {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .hero-info strong {
      font-size: 20px;
      color: white;
    }

    .hero-info span {
      font-size: 12px;
      color: #94a3b8;
    }


    /* =========================
       TOWER VISUAL
       ========================= */

    .hero-visual {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .tower-container {
      position: relative;

      width: 300px;
      height: 360px;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    .tower-glow {
      position: absolute;

      width: 230px;
      height: 230px;

      border-radius: 50%;

      background:
        radial-gradient(
          circle,
          rgba(59, 130, 246, 0.35),
          transparent 65%
        );

      animation: towerGlow 3s ease-in-out infinite;
    }

    @keyframes towerGlow {

      0%,
      100% {
        transform: scale(1);
        opacity: 0.7;
      }

      50% {
        transform: scale(1.2);
        opacity: 1;
      }
    }

    .tower {
      position: relative;

      width: 12px;
      height: 260px;

      background:
        linear-gradient(
          90deg,
          #64748b,
          #e2e8f0,
          #64748b
        );

      clip-path: polygon(
        35% 0,
        65% 0,
        100% 100%,
        0 100%
      );

      z-index: 2;
    }

    .tower-top {
      position: absolute;

      top: -50px;
      left: -35px;

      font-size: 45px;

      animation: antenna 2s ease-in-out infinite;
    }

    @keyframes antenna {

      0%,
      100% {
        transform: translateY(0);
      }

      50% {
        transform: translateY(-6px);
      }
    }

    .tower-base {
      position: absolute;

      bottom: -15px;
      left: -40px;

      width: 90px;
      height: 15px;

      border-radius: 5px;

      background: #475569;
    }

    .tower-line {
      position: absolute;

      height: 2px;

      background: #94a3b8;

      width: 120px;

      left: -54px;
    }

    .line-one {
      top: 60px;
    }

    .line-two {
      top: 130px;
    }

    .line-three {
      top: 200px;
    }


    /* SIGNAL WAVES */

    .signal {
      position: absolute;

      border: 2px solid rgba(96, 165, 250, 0.5);

      border-left-color: transparent;
      border-bottom-color: transparent;

      border-radius: 50%;

      transform: rotate(-45deg);

      animation: signalWave 2.5s infinite;
    }

    .signal-one {
      width: 80px;
      height: 80px;
      right: 15px;
    }

    .signal-two {
      width: 140px;
      height: 140px;
      right: -15px;
      animation-delay: 0.5s;
    }

    .signal-three {
      width: 200px;
      height: 200px;
      right: -45px;
      animation-delay: 1s;
    }

    @keyframes signalWave {

      0% {
        opacity: 0;
        transform: rotate(-45deg) scale(0.8);
      }

      50% {
        opacity: 1;
      }

      100% {
        opacity: 0;
        transform: rotate(-45deg) scale(1.1);
      }
    }


    /* =========================
       STATS
       ========================= */

    .stats-section {
      position: relative;
      z-index: 2;

      max-width: 1200px;

      margin: 10px auto 80px;

      display: grid;

      grid-template-columns:
        repeat(4, 1fr);

      gap: 18px;
    }

    .stat-card {
      display: flex;
      align-items: center;

      gap: 15px;

      padding: 20px;

      border-radius: 18px;

      background: rgba(15, 23, 42, 0.65);

      border: 1px solid rgba(148, 163, 184, 0.12);

      backdrop-filter: blur(15px);

      transition: 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);

      border-color: rgba(96, 165, 250, 0.4);

      background: rgba(30, 41, 59, 0.8);
    }

    .stat-icon {
      width: 50px;
      height: 50px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 14px;

      font-size: 23px;
    }

    .blue {
      background: rgba(59, 130, 246, 0.15);
    }

    .purple {
      background: rgba(168, 85, 247, 0.15);
    }

    .green {
      background: rgba(34, 197, 94, 0.15);
    }

    .orange {
      background: rgba(249, 115, 22, 0.15);
    }

    .stat-number {
      display: block;

      font-size: 22px;
      font-weight: 700;
    }

    .stat-label {
      display: block;

      margin-top: 3px;

      font-size: 12px;

      color: #94a3b8;
    }


    /* =========================
       FEATURES
       ========================= */

    .features-section {
      position: relative;
      z-index: 1;

      max-width: 1200px;

      margin: auto;
    }

    .section-heading {
      text-align: center;

      margin-bottom: 40px;
    }

    .section-label {
      color: #60a5fa;

      font-size: 12px;

      font-weight: 700;

      letter-spacing: 2px;
    }

    .section-heading h2 {
      margin: 12px 0;

      font-size: clamp(2rem, 4vw, 3rem);
    }

    .section-heading p {
      color: #94a3b8;
    }

    .home-cards {
      display: grid;

      grid-template-columns:
        repeat(3, 1fr);

      gap: 22px;
    }

    .feature-card {
      position: relative;

      min-height: 310px;

      padding: 28px !important;

      cursor: pointer;

      border-radius: 22px !important;

      color: white;

      background: rgba(15, 23, 42, 0.75);

      border: 1px solid rgba(148, 163, 184, 0.12);

      backdrop-filter: blur(18px);

      overflow: hidden;

      transition:
        transform 0.3s ease,
        border-color 0.3s ease,
        box-shadow 0.3s ease;
    }

    .feature-card::before {
      content: '';

      position: absolute;

      width: 150px;
      height: 150px;

      border-radius: 50%;

      top: -70px;
      right: -70px;

      opacity: 0.2;

      transition: 0.4s ease;
    }

    .dashboard-card::before {
      background: #3b82f6;
    }

    .operators-card::before {
      background: #a855f7;
    }

    .manager-card::before {
      background: #10b981;
    }

    .feature-card:hover {
      transform: translateY(-10px);

      border-color: rgba(96, 165, 250, 0.4);

      box-shadow:
        0 20px 50px rgba(0, 0, 0, 0.3);
    }

    .feature-card:hover::before {
      transform: scale(2);
    }

    .card-top {
      display: flex;

      align-items: center;

      justify-content: space-between;

      margin-bottom: 25px;
    }

    .feature-icon {
      width: 60px;
      height: 60px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 17px;

      font-size: 27px;
    }

    .dashboard-icon {
      background:
        linear-gradient(
          135deg,
          rgba(59, 130, 246, 0.2),
          rgba(37, 99, 235, 0.05)
        );
    }

    .operator-icon {
      background:
        linear-gradient(
          135deg,
          rgba(168, 85, 247, 0.2),
          rgba(124, 58, 237, 0.05)
        );
    }

    .manager-icon {
      background:
        linear-gradient(
          135deg,
          rgba(16, 185, 129, 0.2),
          rgba(5, 150, 105, 0.05)
        );
    }

    .arrow {
      font-size: 24px;

      color: #64748b;

      transition: 0.25s ease;
    }

    .feature-card:hover .arrow {
      color: #60a5fa;

      transform: translateX(5px);
    }

    .feature-card h2 {
      margin: 0 0 12px;

      font-size: 23px;
    }

    .feature-card p {
      margin: 0;

      color: #94a3b8;

      line-height: 1.7;
    }

    .card-footer {
      position: absolute;

      left: 28px;
      right: 28px;
      bottom: 25px;

      display: flex;

      justify-content: space-between;

      padding-top: 15px;

      border-top: 1px solid rgba(148, 163, 184, 0.1);

      color: #60a5fa;

      font-size: 13px;

      font-weight: 600;
    }


    /* =========================
       QUICK ACTION
       ========================= */

    .quick-section {
      position: relative;

      z-index: 2;

      max-width: 1200px;

      margin: 90px auto 50px;
    }

    .quick-content {
      display: flex;

      align-items: center;

      justify-content: space-between;

      gap: 30px;

      padding: 40px;

      border-radius: 25px;

      background:
        linear-gradient(
          135deg,
          rgba(37, 99, 235, 0.22),
          rgba(124, 58, 237, 0.22)
        );

      border: 1px solid rgba(96, 165, 250, 0.25);
    }

    .quick-content h2 {
      margin: 8px 0;

      font-size: 28px;
    }

    .quick-content p {
      margin: 0;

      color: #a8b5c7;
    }

    .quick-button {
      min-width: 190px;

      min-height: 50px;

      border-radius: 12px !important;

      color: white !important;

      background:
        linear-gradient(
          135deg,
          #2563eb,
          #9333ea
        ) !important;
    }


    /* =========================
       FOOTER
       ========================= */

    .home-footer {
      position: relative;

      z-index: 2;

      max-width: 1200px;

      margin: auto;

      padding: 30px 0;

      border-top:
        1px solid rgba(148, 163, 184, 0.12);

      display: flex;

      justify-content: space-between;

      align-items: center;
    }

    .home-footer strong {
      font-size: 20px;
    }

    .home-footer strong span {
      color: #60a5fa;
    }

    .home-footer p {
      margin: 5px 0 0;

      color: #64748b;

      font-size: 12px;
    }

    .footer-status {
      display: flex;

      align-items: center;

      gap: 8px;

      font-size: 12px;

      color: #94a3b8;
    }

    .status-dot {
      width: 8px;
      height: 8px;

      border-radius: 50%;

      background: #22c55e;

      box-shadow:
        0 0 10px rgba(34, 197, 94, 0.8);
    }


    /* =========================
       RESPONSIVE
       ========================= */

    @media (max-width: 900px) {

      .hero-section {
        grid-template-columns: 1fr;

        text-align: center;
      }

      .hero-actions {
        justify-content: center;
      }

      .hero-info {
        justify-content: center;
      }

      .hero-visual {
        display: none;
      }

      .stats-section {
        grid-template-columns:
          repeat(2, 1fr);

        padding: 0 20px;
      }

      .home-cards {
        grid-template-columns: 1fr;

        padding: 0 20px;
      }

      .features-section {
        padding: 0 10px;
      }

      .quick-section {
        margin-left: 20px;
        margin-right: 20px;
      }

    }


    @media (max-width: 600px) {

      .home-shell {
        padding: 15px;
      }

      .hero-section {
        padding: 35px 10px;
      }

      .hero-content h1 {
        font-size: 3rem;
      }

      .hero-description {
        font-size: 16px;
      }

      .hero-info {
        gap: 20px;
      }

      .stats-section {
        grid-template-columns: 1fr;
      }

      .quick-content {
        flex-direction: column;

        align-items: flex-start;

        padding: 30px;
      }

      .quick-button {
        width: 100%;
      }

      .home-footer {
        flex-direction: column;

        align-items: flex-start;

        gap: 20px;

        padding: 25px 10px;
      }

    }

  `]
})
export class HomePage {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  navigateTo(path: string): void {

    if (
      path !== 'login' &&
      !this.authService.isAuthenticated()
    ) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate([`/${path}`]);
  }
}