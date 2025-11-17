import { Directive, ElementRef, Input, inject, type OnChanges, type SimpleChanges } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

/**
 * SafeHtml Directive
 *
 * Sanitizes and safely renders HTML content including SVG icons.
 * This directive bypasses Angular's default sanitization for trusted HTML content.
 *
 * @example
 * ```html
 * <span [appSafeHtml]="svgIconString"></span>
 * <div [appSafeHtml]="htmlContent"></div>
 * ```
 *
 * @warning Only use this directive with trusted HTML content from your own application.
 * Never use it with user-generated content or content from untrusted sources.
 */
@Directive({
  selector: "[appSafeHtml]",
  standalone: true,
})
export class SafeHtmlDirective implements OnChanges {
  private elementRef = inject(ElementRef);
  private sanitizer = inject(DomSanitizer);

  /**
   * The HTML string to sanitize and render
   */
  @Input({ required: true }) appSafeHtml = "";

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["appSafeHtml"]) {
      this.updateContent();
    }
  }

  private updateContent(): void {
    if (!this.appSafeHtml) {
      this.elementRef.nativeElement.innerHTML = "";
      return;
    }

    // Sanitize and set the HTML content
    const sanitized = this.sanitizer.sanitize(1, this.appSafeHtml) || "";
    this.elementRef.nativeElement.innerHTML = sanitized;
  }
}
