export type TipoRefeicao = 'manha' | 'almoco' | 'tarde' | 'noite';

export interface Refeicao {
  tipo: TipoRefeicao;
  texto: string;
  calorias: number; // kcal
  explicacao?: string;
  criadoEmISO: string; // ISO datetime
}

export interface RegistroDiario {
  dataISO: string; // yyyy-mm-dd
  refeicoes: Partial<Record<TipoRefeicao, Refeicao>>;
}

