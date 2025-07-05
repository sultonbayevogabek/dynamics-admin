import { Directive, ElementRef, HostListener, Injector, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[pasteOnFocus]',
  standalone: true
})
export class PasteOnFocusDirective implements OnDestroy {
  private ngControl: NgControl | null = null;

  constructor(
    private elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
    private injector: Injector
  ) {
    try {
      this.ngControl = this.injector.get(NgControl, null);
    } catch {
      this.ngControl = null;
    }
  }

  @HostListener('focus', [ '$event' ])
  async onFocus(event: FocusEvent): Promise<void> {
    try {
      const clipboardText = await navigator.clipboard.readText();

      if (clipboardText) {
        const element = this.elementRef.nativeElement;

        if (this.ngControl && this.ngControl.control) {
          this.ngControl.control.setValue(clipboardText);
        } else {
          element.value = clipboardText;

          element.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    } catch (error) {
      console.warn('Clipboard o\'qishda xatolik:', error);
    }
  }

  ngOnDestroy(): void {
    this.ngControl = null;
  }
}
