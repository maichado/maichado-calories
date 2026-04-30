import { Injectable, inject } from '@angular/core';
import { MetaSemanal, StatusMetaSemanal } from '../models/meta.model';
import { StorageService } from './storage.service';

function parseIsoDate(dateISO: string): Date {
  const [y, m, d] = dateISO.split('-').map((n) => Number(n));
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function isoDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

@Injectable({ providedIn: 'root' })
export class MetaService {
  private readonly storage = inject(StorageService);

  /**
   * Gera metas semanais automaticamente com alvo de 1.5kg/semana.
   * - Se o peso meta for menor que o inicial, a meta desce 1.5kg/semana (até o alvo).
   * - Se for maior, sobe 1.5kg/semana.
   */
  gerarMetasSemanais(): MetaSemanal[] {
    const s = this.storage.load();
    const u = s.usuario;
    if (!u) return [];

    const start = parseIsoDate(u.dataInicioISO);
    const end = parseIsoDate(u.dataMetaISO);

    const totalWeeks = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (7 * 864e5)));
    const direction = u.pesoMetaKg >= u.pesoInicialKg ? 1 : -1;
    const stepKg = 1.5 * direction;

    const metas: MetaSemanal[] = [];
    for (let i = 0; i < totalWeeks; i++) {
      const weekStart = addDays(start, i * 7);
      const weekEnd = addDays(weekStart, 6);
      const rawTarget = u.pesoInicialKg + stepKg * (i + 1);
      const pesoAlvoKg =
        direction === 1 ? Math.min(rawTarget, u.pesoMetaKg) : Math.max(rawTarget, u.pesoMetaKg);

      const status = this.computeStatus(isoDate(weekEnd), pesoAlvoKg);
      metas.push({
        semanaInicioISO: isoDate(weekStart),
        semanaFimISO: isoDate(weekEnd),
        pesoAlvoKg: Math.round(pesoAlvoKg * 10) / 10,
        status
      });
    }

    return metas;
  }

  private computeStatus(weekEndISO: string, pesoAlvoKg: number): StatusMetaSemanal {
    const todayISO = isoDate(new Date());
    if (todayISO <= weekEndISO) return 'pendente';

    const pesoReal = this.getPesoAte(weekEndISO);
    if (pesoReal == null) return 'atrasada';

    const s = this.storage.load();
    const u = s.usuario;
    if (!u) return 'pendente';

    const direction = u.pesoMetaKg >= u.pesoInicialKg ? 1 : -1;
    const hit =
      direction === -1
        ? pesoReal <= pesoAlvoKg + 0.05
        : pesoReal >= pesoAlvoKg - 0.05;

    return hit ? 'batida' : 'atrasada';
  }

  /** Último peso registrado em (ou antes de) dateISO. */
  private getPesoAte(dateISO: string): number | null {
    const s = this.storage.load();
    const dates = Object.keys(s.pesos).filter((d) => d <= dateISO).sort();
    const last = dates.at(-1);
    return last ? s.pesos[last]?.pesoKg ?? null : null;
  }
}

