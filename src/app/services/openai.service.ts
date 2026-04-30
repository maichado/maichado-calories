import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StorageService } from './storage.service';

export type OpenAiCalorieEstimate = {
  calories: number;
  explanation: string;
};

type ResponsesApiOutputText = { type: 'output_text'; text: string };
type ResponsesApiOutput = { content?: Array<ResponsesApiOutputText | unknown> } | unknown;
type ResponsesApiResponse = { output?: ResponsesApiOutput[] } | unknown;

@Injectable({ providedIn: 'root' })
export class OpenAiService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);

  get apiKey(): string | undefined {
    const { openAiApiKey } = this.storage.load();
    return openAiApiKey?.trim() ? openAiApiKey.trim() : undefined;
  }

  setApiKey(key: string): void {
    const trimmed = key.trim();
    this.storage.update((s) => ({ ...s, openAiApiKey: trimmed || undefined }));
  }

  async estimateCaloriesFromText(text: string): Promise<OpenAiCalorieEstimate> {
    const apiKey = this.apiKey;
    if (!apiKey) throw new Error('OpenAI API key não configurada.');

    const url = 'https://api.openai.com/v1/responses';

    const payload = {
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content:
            'Você é um nutricionista. Estime calorias para uma refeição descrita em PT-BR. Responda SOMENTE em JSON válido no formato {"calories": number, "explanation": string}.'
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.2,
      max_output_tokens: 220
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    });

    const res = await firstValueFrom(
      this.http.post<ResponsesApiResponse>(url, payload, { headers })
    );

    const outputText = this.extractOutputText(res);
    const parsed = this.parseJsonEstimate(outputText);
    return parsed;
  }

  private extractOutputText(res: ResponsesApiResponse): string {
    if (!res || typeof res !== 'object') throw new Error('Resposta inválida da OpenAI.');
    const output = (res as any).output;
    if (!Array.isArray(output)) throw new Error('Resposta inválida da OpenAI.');
    for (const item of output) {
      const content = (item as any)?.content;
      if (!Array.isArray(content)) continue;
      for (const c of content) {
        if ((c as any)?.type === 'output_text' && typeof (c as any)?.text === 'string') {
          return (c as any).text as string;
        }
      }
    }
    throw new Error('Não foi possível ler a resposta da OpenAI.');
  }

  private parseJsonEstimate(text: string): OpenAiCalorieEstimate {
    const trimmed = text.trim();

    // The model might wrap JSON in code fences; handle safely.
    const cleaned = trimmed
      .replace(/^```(json)?/i, '')
      .replace(/```$/i, '')
      .trim();

    let obj: any;
    try {
      obj = JSON.parse(cleaned);
    } catch {
      throw new Error('A OpenAI retornou um JSON inválido.');
    }

    const calories = Number(obj?.calories);
    const explanation = typeof obj?.explanation === 'string' ? obj.explanation : '';
    if (!Number.isFinite(calories) || calories <= 0) {
      throw new Error('A OpenAI retornou calorias inválidas.');
    }

    return {
      calories: Math.round(calories),
      explanation: explanation.trim() || 'Estimativa baseada no texto informado.'
    };
  }
}

