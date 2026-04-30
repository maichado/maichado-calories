import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { Usuario } from '../../models/usuario.model';

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

@Component({
  selector: 'app-cadastro-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="mc-grid cadastro">
      <div class="mc-card">
        <div class="mc-card__inner">
          <h1 class="mc-title cadastro__title">Criar conta no Vivae</h1>
          <p class="mc-subtitle">
            Configure seu perfil inicial para personalizar TMB, calorias diárias e metas semanais.
          </p>

          <form class="mc-form cadastro__form" (ngSubmit)="onSubmit()">
            <div class="cadastro__step">
              <h2 class="cadastro__stepTitle">1. Dados pessoais</h2>
              <div class="mc-row">
                <label class="mc-field">
                  Nome
                  <input class="mc-input" [(ngModel)]="form.nome" name="nome" required />
                </label>
                <label class="mc-field">
                  Idade
                  <input class="mc-input" type="number" min="12" [(ngModel)]="form.idade" name="idade" required />
                </label>
              </div>
              <div class="mc-row">
                <label class="mc-field">
                  Sexo biológico
                  <select class="mc-input" [(ngModel)]="form.sexo" name="sexo">
                    <option [ngValue]="'F'">Feminino</option>
                    <option [ngValue]="'M'">Masculino</option>
                  </select>
                </label>
                <label class="mc-field">
                  Altura (cm)
                  <input class="mc-input" type="number" min="120" [(ngModel)]="form.alturaCm" name="alturaCm" />
                </label>
              </div>
            </div>

            <div class="cadastro__step">
              <h2 class="cadastro__stepTitle">2. Objetivo</h2>
              <div class="mc-row">
                <label class="mc-field">
                  Peso atual (kg)
                  <input
                    class="mc-input"
                    type="number"
                    step="0.1"
                    min="30"
                    [(ngModel)]="form.pesoAtualKg"
                    name="pesoAtualKg"
                    required
                  />
                </label>
                <label class="mc-field">
                  Peso meta (kg)
                  <input
                    class="mc-input"
                    type="number"
                    step="0.1"
                    min="30"
                    [(ngModel)]="form.pesoMetaKg"
                    name="pesoMetaKg"
                    required
                  />
                </label>
              </div>
              <div class="mc-row">
                <label class="mc-field">
                  Data de início
                  <input class="mc-input" type="date" [(ngModel)]="form.dataInicioISO" name="dataInicioISO" />
                </label>
                <label class="mc-field">
                  Data alvo
                  <input class="mc-input" type="date" [(ngModel)]="form.dataMetaISO" name="dataMetaISO" />
                </label>
              </div>
            </div>

            <div class="cadastro__actions">
              <button class="mc-btn mc-btn--ghost" type="button" (click)="goToInicio()">Voltar</button>
              <button class="mc-btn mc-btn--primary" type="submit">Criar minha conta grátis</button>
            </div>
            @if (msg(); as message) {
              <p class="cadastro__msg">{{ message }}</p>
            }
          </form>
        </div>
      </div>
    </section>
  `,
  styleUrl: './cadastro.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CadastroPage {
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);
  protected readonly msg = signal('');

  private readonly today = new Date();

  protected readonly form: Usuario = {
    nome: '',
    idade: 28,
    sexo: 'M',
    alturaCm: 170,
    pesoAtualKg: 80,
    pesoInicialKg: 80,
    pesoMetaKg: 70,
    dataInicioISO: isoDate(this.today),
    dataMetaISO: isoDate(new Date(this.today.getFullYear(), this.today.getMonth() + 3, this.today.getDate()))
  };

  protected goToInicio(): void {
    this.router.navigateByUrl('/inicio');
  }

  protected onSubmit(): void {
    const usuario: Usuario = {
      ...this.form,
      nome: this.form.nome.trim(),
      idade: Number(this.form.idade || 0),
      alturaCm: Number(this.form.alturaCm || 0),
      pesoAtualKg: Number(this.form.pesoAtualKg || 0),
      pesoInicialKg: Number(this.form.pesoAtualKg || 0),
      pesoMetaKg: Number(this.form.pesoMetaKg || 0)
    };

    if (!usuario.nome || !usuario.idade || !usuario.pesoAtualKg || !usuario.pesoMetaKg) {
      this.msg.set('Preencha os campos obrigatórios para continuar.');
      return;
    }

    this.storage.update((s) => ({
      ...s,
      usuario,
      ui: { ...(s.ui ?? {}), onboardingDone: true }
    }));
    this.router.navigateByUrl('/dashboard');
  }
}

