import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2, inject, input } from '@angular/core';

@Directive({
  selector: '[appInViewAnimate]',
  standalone: true
})
export class InViewAnimateDirective implements AfterViewInit, OnDestroy {
  threshold = input<number>(0.2);
  once = input<boolean>(true);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    this.renderer.addClass(node, 'in-view-init');

    if (typeof IntersectionObserver === 'undefined') {
      this.renderer.addClass(node, 'in-view-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.renderer.addClass(node, 'in-view-visible');
            if (this.once()) {
              this.observer?.unobserve(node);
            }
          } else if (!this.once()) {
            this.renderer.removeClass(node, 'in-view-visible');
          }
        }
      },
      { threshold: this.threshold() }
    );

    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

