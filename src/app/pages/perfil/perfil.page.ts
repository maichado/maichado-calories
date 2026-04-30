import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpenAiService } from '../../services/openai.service';
import { StorageService } from '../../services/storage.service';
import { Usuario } from '../../models/usuario.model';
import { InViewAnimateDirective } from '../../shared/directives/in-view-animate.directive';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [FormsModule, InViewAnimateDirective],
  template: `
    <section class="mc-grid" appInViewAnimate>
      <div class="mc-card">
        <div class="mc-card__inner">
          <h2 class="mc-title">Perfil</h2>
          <p class="mc-subtitle">
            A TMB usa Harris-Benedict. Se você não preencher sexo/altura, usamos defaults (sexo=M,
            altura=170cm) e mostramos isso no Dashboard.
          </p>

          <div class="mc-form">
            <label class="mc-field">
              <span>Nome</span>
              <input class="mc-input" [(ngModel)]="form.nome" />
            </label>

            <div class="mc-row">
              <label class="mc-field">
                <span>Idade</span>
                <input class="mc-input" type="number" [(ngModel)]="form.idade" />
              </label>
              <label class="mc-field">
                <span>Sexo (opcional)</span>
                <select class="mc-input" [(ngModel)]="form.sexo">
                  <option [ngValue]="undefined">Default</option>
                  <option [ngValue]="'M'">M</option>
                  <option [ngValue]="'F'">F</option>
                </select>
              </label>
            </div>

            <div class="mc-row">
              <label class="mc-field">
                <span>Altura (cm, opcional)</span>
                <input class="mc-input" type="number" [(ngModel)]="form.alturaCm" />
              </label>
              <label class="mc-field">
                <span>Peso atual (kg)</span>
                <input class="mc-input" type="number" step="0.1" [(ngModel)]="form.pesoAtualKg" />
              </label>
            </div>

            <div class="mc-row">
              <label class="mc-field">
                <span>Peso inicial (kg)</span>
                <input class="mc-input" type="number" step="0.1" [(ngModel)]="form.pesoInicialKg" />
              </label>
              <label class="mc-field">
                <span>Peso meta (kg)</span>
                <input class="mc-input" type="number" step="0.1" [(ngModel)]="form.pesoMetaKg" />
              </label>
            </div>

            <div class="mc-row">
              <label class="mc-field">
                <span>Data início</span>
                <input class="mc-input" type="date" [(ngModel)]="form.dataInicioISO" />
              </label>
              <label class="mc-field">
                <span>Data meta</span>
                <input class="mc-input" type="date" [(ngModel)]="form.dataMetaISO" />
              </label>
            </div>

            <button class="mc-btn" type="button" (click)="saveUsuario()">Salvar perfil</button>
            @if (statusMsg(); as msg) {
              <div class="mc-status">{{ msg }}</div>
            }
          </div>
        </div>
      </div>

      <div class="mc-card">
        <div class="mc-card__inner">
          <h3 class="mc-title">OpenAI</h3>
          <p class="mc-subtitle">A key fica salva no seu navegador (localStorage).</p>

          <div class="mc-form">
            <label class="mc-field">
              <span>API key</span>
              <input class="mc-input" type="password" [(ngModel)]="openAiKey" placeholder="sk-..." />
            </label>
            <button class="mc-btn" type="button" (click)="saveKey()">Salvar key</button>
          </div>
        </div>
      </div>

      <div class="mc-card">
        <div class="mc-card__inner">
          <h3 class="mc-title">Backup / Restore</h3>
          <p class="mc-subtitle">Exporte/importa um JSON com seus dados (schema v{{ schemaVersion() }}).</p>

          <div class="mc-actions">
            <button class="mc-btn" type="button" (click)="exportBackup()">Exportar JSON</button>
            <label class="mc-btn mc-btn--ghost">
              Importar JSON
              <input type="file" accept="application/json" (change)="onImport($event)" hidden />
            </label>
          </div>

          @if (backupMsg(); as msg) {
            <div class="mc-status">{{ msg }}</div>
          }
        </div>
      </div>

      <div class="mc-card">
        <div class="mc-card__inner">
          <h3 class="mc-title">Apresentação</h3>
          <p class="mc-subtitle">Você pode rever o tour inicial quando quiser.</p>
          <button class="mc-btn mc-btn--ghost" type="button" (click)="resetOnboarding()">
            Rever apresentação
          </button>
        </div>
      </div>
    </section>
  `,
  styleUrl: './perfil.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerfilPage {
  private readonly storage = inject(StorageService);
  private readonly openai = inject(OpenAiService);

  protected readonly schemaVersion = computed(() => this.storage.schemaVersion);

  protected readonly statusMsg = signal<string>('');
  protected readonly backupMsg = signal<string>('');

  protected openAiKey = this.openai.apiKey ?? '';

  protected form: Usuario = this.buildInitialForm();

  private buildInitialForm(): Usuario {
    const s = this.storage.load();
    const today = new Date();
    const iso = (d: Date) => d.toISOString().slice(0, 10);
    return (
      s.usuario ?? {
        nome: '',
        idade: 28,
        sexo: undefined,
        alturaCm: undefined,
        pesoAtualKg: 80,
        pesoInicialKg: 80,
        pesoMetaKg: 70,
        dataInicioISO: iso(today),
        dataMetaISO: iso(new Date(today.getFullYear(), today.getMonth() + 3, today.getDate()))
      }
    );
  }

  saveUsuario(): void {
    const u: Usuario = {
      ...this.form,
      nome: (this.form.nome ?? '').trim(),
      idade: Number(this.form.idade ?? 0),
      alturaCm: this.form.alturaCm != null ? Number(this.form.alturaCm) : undefined,
      pesoAtualKg: Number(this.form.pesoAtualKg ?? 0),
      pesoInicialKg: Number(this.form.pesoInicialKg ?? 0),
      pesoMetaKg: Number(this.form.pesoMetaKg ?? 0),
      dataInicioISO: this.form.dataInicioISO,
      dataMetaISO: this.form.dataMetaISO
    };

    this.storage.update((s) => ({ ...s, usuario: u }));
    this.statusMsg.set('Perfil salvo.');
    setTimeout(() => this.statusMsg.set(''), 1600);
  }

  saveKey(): void {
    this.openai.setApiKey(this.openAiKey ?? '');
    this.statusMsg.set('OpenAI key salva.');
    setTimeout(() => this.statusMsg.set(''), 1600);
  }

  exportBackup(): void {
    const blob = this.storage.exportBackupBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vivae-backup-v${this.storage.schemaVersion}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.backupMsg.set('Backup exportado.');
    setTimeout(() => this.backupMsg.set(''), 1600);
  }

  async onImport(ev: Event): Promise<void> {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const text = await file.text();
    const res = this.storage.restoreFromJson(text);
    this.backupMsg.set(res.ok ? 'Restore concluído.' : res.error);
    setTimeout(() => this.backupMsg.set(''), 2600);
    input.value = '';
  }

  resetOnboarding(): void {
    this.storage.update((s) => ({ ...s, ui: { ...(s.ui ?? {}), onboardingDone: false } }));
    this.statusMsg.set('Apresentação reativada. Volte no Início.');
    setTimeout(() => this.statusMsg.set(''), 2000);
  }
}

