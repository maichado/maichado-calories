import { Injectable, inject } from '@angular/core';
import { RegistroPeso } from '../models/registro-peso.model';
import { StorageService } from './storage.service';

function isoDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

@Injectable({ providedIn: 'root' })
export class PesoService {
  private readonly storage = inject(StorageService);

  getRegistro(dateISO: string = isoDate(new Date())): RegistroPeso | undefined {
    const s = this.storage.load();
    return s.pesos[dateISO];
  }

  getUltimoRegistro(): RegistroPeso | undefined {
    const s = this.storage.load();
    const dates = Object.keys(s.pesos).sort();
    const last = dates.at(-1);
    return last ? s.pesos[last] : undefined;
  }

  setPeso(pesoKg: number, dateISO: string = isoDate(new Date())): RegistroPeso {
    const registro: RegistroPeso = { dataISO: dateISO, pesoKg };
    this.storage.update((s) => {
      const pesos = { ...s.pesos, [dateISO]: registro };
      const usuario = s.usuario ? { ...s.usuario, pesoAtualKg: pesoKg } : s.usuario;
      return { ...s, pesos, usuario };
    });
    return registro;
  }
}

