import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  viewChild
} from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-grafico-peso',
  standalone: true,
  template: `
    <div class="mc-card">
      <div class="mc-card__inner">
        <div class="mc-chart__top">
          <h3 class="mc-title">Evolução do peso</h3>
          <p class="mc-subtitle">Últimos registros</p>
        </div>

        <canvas #canvas class="mc-chart__canvas" aria-label="Gráfico de peso"></canvas>
      </div>
    </div>
  `,
  styleUrl: './grafico-peso.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraficoPesoComponent implements AfterViewInit {
  labels = input.required<string[]>();
  values = input.required<number[]>();

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  private chart?: Chart;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.chart = new Chart(this.canvas().nativeElement, this.buildConfig());

    effect(() => {
      const labels = this.labels();
      const values = this.values();
      if (!this.chart) return;
      this.chart.data.labels = labels;
      (this.chart.data.datasets[0].data as number[]) = values;
      this.chart.update();
    });

    this.destroyRef.onDestroy(() => this.chart?.destroy());
  }

  private buildConfig(): ChartConfiguration<'line'> {
    return {
      type: 'line',
      data: {
        labels: this.labels(),
        datasets: [
          {
            label: 'Peso (kg)',
            data: this.values(),
            borderColor: 'rgba(40, 102, 118, 0.9)',
            backgroundColor: 'rgba(40, 102, 118, 0.12)',
            tension: 0.3,
            fill: true,
            pointRadius: 2.5,
            pointHoverRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          x: {
            grid: { color: 'rgba(40,102,118,0.08)' },
            ticks: { color: 'rgba(29,42,48,0.7)', maxRotation: 0 }
          },
          y: {
            grid: { color: 'rgba(40,102,118,0.08)' },
            ticks: { color: 'rgba(29,42,48,0.7)' }
          }
        }
      }
    };
  }
}

