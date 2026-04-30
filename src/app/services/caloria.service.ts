import { Injectable, inject } from '@angular/core';
import { Refeicao, RegistroDiario, TipoRefeicao } from '../models/refeicao.model';
import { OpenAiService } from './openai.service';
import { StorageService } from './storage.service';

export type CalorieEstimate = { calories: number; explanation: string; provider: 'openai' | 'heuristic' };

function isoDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

@Injectable({ providedIn: 'root' })
export class CaloriaService {
  private readonly storage = inject(StorageService);
  private readonly openai = inject(OpenAiService);

  getRegistroDoDia(dateISO: string = isoDate(new Date())): RegistroDiario {
    const schema = this.storage.load();
    return schema.diarios[dateISO] ?? { dataISO: dateISO, refeicoes: {} };
  }

  getTotalDoDia(dateISO: string = isoDate(new Date())): number {
    const diario = this.getRegistroDoDia(dateISO);
    return Object.values(diario.refeicoes)
      .filter(Boolean)
      .reduce((sum, r) => sum + (r?.calorias ?? 0), 0);
  }

  async registrarRefeicao(
    tipo: TipoRefeicao,
    texto: string,
    dateISO: string = isoDate(new Date())
  ): Promise<Refeicao> {
    const estimate = await this.estimateCalories(texto);
    const refeicao: Refeicao = {
      tipo,
      texto,
      calorias: estimate.calories,
      explicacao: estimate.explanation,
      criadoEmISO: new Date().toISOString()
    };

    this.storage.update((s) => {
      const diario: RegistroDiario = s.diarios[dateISO] ?? { dataISO: dateISO, refeicoes: {} };
      const next: RegistroDiario = {
        ...diario,
        refeicoes: { ...diario.refeicoes, [tipo]: refeicao }
      };
      return { ...s, diarios: { ...s.diarios, [dateISO]: next } };
    });

    return refeicao;
  }

  async estimateCalories(text: string): Promise<CalorieEstimate> {
    const normalized = text.trim();
    if (!normalized) return { calories: 0, explanation: 'Texto vazio.', provider: 'heuristic' };

    if (this.openai.apiKey) {
      try {
        const res = await this.openai.estimateCaloriesFromText(normalized);
        return { calories: res.calories, explanation: res.explanation, provider: 'openai' };
      } catch {
        // Silently fallback: user is in control of key; we avoid noisy logs.
      }
    }

    const heuristic = this.heuristicEstimate(normalized);
    return { ...heuristic, provider: 'heuristic' };
  }

  private heuristicEstimate(text: string): { calories: number; explanation: string } {
    const t = text.toLowerCase();
    const keywords: Array<[RegExp, number]> = [
      [/\b(arroz|feij[aã]o|macarr[aã]o|massa|p[aã]o|batata)\b/g, 260],
      [/\b(frango|carne|bife|peixe|atum|ovo|ovos)\b/g, 220],
      [/\b(queijo|leite|iogurte|manteiga)\b/g, 180],
      [/\b(salada|legumes?|verduras?)\b/g, 70],
      [/\b(chocolate|doce|bolo|sorvete)\b/g, 320],
      [/\b(refrigerante|suco)\b/g, 140]
    ];

    let score = 140; // base snack
    for (const [re, add] of keywords) {
      const matches = t.match(re);
      if (matches?.length) score += add * clamp(matches.length, 1, 3);
    }

    // Scale a bit with text length
    const words = t.split(/\s+/).filter(Boolean).length;
    score += clamp(words * 12, 0, 380);

    const calories = clamp(Math.round(score / 10) * 10, 80, 1400);
    return {
      calories,
      explanation:
        'Estimativa heurística local (sem OpenAI). Para maior precisão, configure a chave no Perfil.'
    };
  }
}

