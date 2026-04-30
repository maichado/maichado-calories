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
  selector: 'app-grafico-calorias',
  standalone: true,
  template: `
    <div class="mc-card">
      <div class="mc-card__inner">
        <div class="mc-chart__top">
          <h3 class="mc-title">Calorias na semana</h3>
          <p class="mc-subtitle">Consumo diário (kcal)</p>
        </div>

        <canvas #canvas class="mc-chart__canvas" aria-label="Gráfico de calorias"></canvas>
      </div>
    </div>
  `,
  styleUrl: './grafico-calorias.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraficoCaloriasComponent implements AfterViewInit {
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

  private buildConfig(): ChartConfiguration<'bar'> {
    return {
      type: 'bar',
      data: {
        labels: this.labels(),
        datasets: [
          {
            label: 'kcal',
            data: this.values(),
            backgroundColor: 'rgba(40, 102, 118, 0.2)',
            borderColor: 'rgba(40, 102, 118, 0.55)',
            borderWidth: 1,
            borderRadius: 10
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
            grid: { display: false },
            ticks: { color: 'rgba(29,42,48,0.7)' }
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

