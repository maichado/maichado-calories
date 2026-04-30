export type StatusMetaSemanal = 'pendente' | 'batida' | 'atrasada';

export interface MetaSemanal {
  semanaInicioISO: string; // yyyy-mm-dd
  semanaFimISO: string; // yyyy-mm-dd
  pesoAlvoKg: number;
  status: StatusMetaSemanal;
}

