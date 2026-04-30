import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LandingHeaderComponent } from '../../components/landing/landing-header/landing-header.component';
import { LandingHeroComponent } from '../../components/landing/landing-hero/landing-hero.component';
import { LandingDiscoverComponent } from '../../components/landing/landing-discover/landing-discover.component';
import { LandingHowItWorksComponent } from '../../components/landing/landing-how-it-works/landing-how-it-works.component';
import { LandingImpactMetricsComponent } from '../../components/landing/landing-impact-metrics/landing-impact-metrics.component';
import { LandingFeatureBlocksComponent } from '../../components/landing/landing-feature-blocks/landing-feature-blocks.component';
import { LandingTestimonialsComponent } from '../../components/landing/landing-testimonials/landing-testimonials.component';
import { LandingFinalCtaComponent } from '../../components/landing/landing-final-cta/landing-final-cta.component';
import { LandingFooterComponent } from '../../components/landing/landing-footer/landing-footer.component';

@Component({
  selector: 'app-inicio-page',
  standalone: true,
  imports: [
    LandingHeaderComponent,
    LandingHeroComponent,
    LandingDiscoverComponent,
    LandingHowItWorksComponent,
    LandingImpactMetricsComponent,
    LandingFeatureBlocksComponent,
    LandingTestimonialsComponent,
    LandingFinalCtaComponent,
    LandingFooterComponent
  ],
  template: `
    <app-landing-header />
    <app-landing-hero />
    <app-landing-discover />
    <app-landing-how-it-works />
    <app-landing-impact-metrics />
    <app-landing-feature-blocks />
    <app-landing-testimonials />
    <app-landing-final-cta />
    <app-landing-footer />
  `,
  styleUrl: './inicio.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InicioPage {}
