import { Injectable, signal } from '@angular/core';

export type AppTheme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'towersync_theme';
  
  public currentTheme = signal<AppTheme>(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.currentTheme());
  }

  public get isDark(): boolean {
    return this.currentTheme() === 'dark';
  }

  public toggleTheme(): void {
    const nextTheme: AppTheme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  public setTheme(theme: AppTheme): void {
    this.currentTheme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  private getInitialTheme(): AppTheme {
    const saved = localStorage.getItem(this.THEME_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    return 'dark';
  }

  private applyTheme(theme: AppTheme): void {
    const root = document.documentElement;
    const body = document.body;
    
    if (theme === 'light') {
      root.classList.remove('theme-dark');
      root.classList.add('theme-light');
      body.classList.remove('theme-dark');
      body.classList.add('theme-light');
    } else {
      root.classList.remove('theme-light');
      root.classList.add('theme-dark');
      body.classList.remove('theme-light');
      body.classList.add('theme-dark');
    }
  }
}
