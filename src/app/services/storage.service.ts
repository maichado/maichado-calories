import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RegistroDiario } from '../models/refeicao.model';
import { RegistroPeso } from '../models/registro-peso.model';
import { Usuario } from '../models/usuario.model';

export type StorageSchemaV1 = {
  version: 1;
  updatedAtISO: string;
  usuario?: Usuario;
  openAiApiKey?: string;
  ui?: {
    onboardingDone?: boolean;
  };
  diarios: Record<string, RegistroDiario>; // yyyy-mm-dd
  pesos: Record<string, RegistroPeso>; // yyyy-mm-dd
};

const STORAGE_KEY = 'maichado-calories:schema';
const CURRENT_VERSION = 1 as const;

function nowIso(): string {
  return new Date().toISOString();
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function emptySchema(): StorageSchemaV1 {
  return {
    version: CURRENT_VERSION,
    updatedAtISO: nowIso(),
    ui: {},
    diarios: {},
    pesos: {}
  };
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private memorySchema: StorageSchemaV1 | null = null;

  get schemaVersion(): number {
    return CURRENT_VERSION;
  }

  load(): StorageSchemaV1 {
    if (!isPlatformBrowser(this.platformId)) {
      this.memorySchema ??= emptySchema();
      return this.memorySchema;
    }

    const raw = globalThis.localStorage?.getItem(STORAGE_KEY) ?? null;
    if (!raw) return emptySchema();

    const parsed = safeJsonParse(raw);
    if (!parsed || typeof parsed !== 'object') return emptySchema();

    const maybe = parsed as Partial<StorageSchemaV1>;
    if (maybe.version !== CURRENT_VERSION) return emptySchema();

    return {
      ...emptySchema(),
      ...maybe,
      version: CURRENT_VERSION,
      ui: maybe.ui ?? {},
      diarios: maybe.diarios ?? {},
      pesos: maybe.pesos ?? {}
    };
  }

  save(next: StorageSchemaV1): void {
    const normalized: StorageSchemaV1 = {
      ...next,
      version: CURRENT_VERSION,
      updatedAtISO: nowIso(),
      ui: next.ui ?? {},
      diarios: next.diarios ?? {},
      pesos: next.pesos ?? {}
    };
    if (!isPlatformBrowser(this.platformId)) {
      this.memorySchema = normalized;
      return;
    }
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(normalized));
  }

  update(mutator: (schema: StorageSchemaV1) => StorageSchemaV1): StorageSchemaV1 {
    const current = this.load();
    const next = mutator(current);
    this.save(next);
    return next;
  }

  exportBackupBlob(): Blob {
    const schema = this.load();
    const json = JSON.stringify(schema, null, 2);
    return new Blob([json], { type: 'application/json' });
  }

  restoreFromJson(jsonText: string): { ok: true } | { ok: false; error: string } {
    const parsed = safeJsonParse(jsonText);
    if (!parsed || typeof parsed !== 'object') return { ok: false, error: 'JSON inválido.' };

    const maybe = parsed as Partial<StorageSchemaV1>;
    if (maybe.version !== CURRENT_VERSION) {
      return {
        ok: false,
        error: `Versão de schema incompatível. Esperada v${CURRENT_VERSION}.`
      };
    }

    const next: StorageSchemaV1 = {
      ...emptySchema(),
      ...maybe,
      version: CURRENT_VERSION,
      ui: maybe.ui ?? {},
      diarios: maybe.diarios ?? {},
      pesos: maybe.pesos ?? {}
    };

    this.save(next);
    return { ok: true };
  }

  clearAll(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.memorySchema = emptySchema();
      return;
    }
    globalThis.localStorage?.removeItem(STORAGE_KEY);
  }
}

