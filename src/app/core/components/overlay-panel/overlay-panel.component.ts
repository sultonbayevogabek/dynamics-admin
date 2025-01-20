import { Component, DestroyRef, inject, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'overlay-panel',
  templateUrl: './overlay-panel.component.html',
  standalone: true
})

export class OverlayComponent {
  @Input() originElement: HTMLElement;
  @ViewChild('overlayPanel') private overlayPanel: TemplateRef<any>;
  _overlayRef: OverlayRef;
  _destroyRef = inject(DestroyRef);

  _overlay: Overlay = inject(Overlay);
  _viewContainerRef: ViewContainerRef = inject(ViewContainerRef);

  openPanel(): void {
    if (!this.overlayPanel || !this.originElement) {
      return;
    }
    if (!this._overlayRef) {
      this._createOverlay();
    }

    this._overlayRef.attach(new TemplatePortal(this.overlayPanel, this._viewContainerRef));
  }

  private _createOverlay(): void {
    this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      backdropClass: '',
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(this.originElement)
        .withLockedPosition(true)
        .withPush(true)
        .withPositions([
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top'
          }
        ])
    });

    this._overlayRef.backdropClick()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(_ => {
        this._overlayRef.detach();
      });

    this._overlayRef.keydownEvents()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(event => {
        if (event.key === 'Escape') {
          this._overlayRef.detach();
        }
      });
  }
}
