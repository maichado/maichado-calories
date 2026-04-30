export type Sexo = 'M' | 'F';

export interface Usuario {
  nome: string;
  idade: number; // anos

  // Campos opcionais para TMB (Harris-Benedict revisada)
  sexo?: Sexo;
  alturaCm?: number;

  pesoAtualKg: number;
  pesoInicialKg: number;
  pesoMetaKg: number;

  dataInicioISO: string; // yyyy-mm-dd
  dataMetaISO: string; // yyyy-mm-dd
}

