import { NgTemplateOutlet } from "@angular/common";
import {
  type AfterContentInit,
  Component,
  ElementRef,
  effect,
  inject,
  input,
  type OnChanges,
  type SimpleChanges,
  signal,
  type TemplateRef,
} from "@angular/core";
import { cn } from "@/utils/classes";
import { uuid } from "@/utils/functions";

const DATA_SCOPE = "field";

/**-----------------------------------------------------------------------------
 * Field Component
 * -----------------------------------------------------------------------------
 * Used to add labels, help text, and error messages to form fields.
 * Angular equivalent of the React Field component.
 *
 * Usage:
 * ```html
 * <app-field
 *   [label]="'Email Address'"
 *   [required]="true"
 *   [invalid]="isInvalid"
 *   [errorText]="'Invalid email address'"
 *   [helperText]="'We will never share your email'"
 * >
 *   <input type="email" class="..." />
 * </app-field>
 * ```
 * -----------------------------------------------------------------------------*/
@Component({
  selector: "app-field",
  imports: [NgTemplateOutlet],
  template: `
    <fieldset
      [id]="ids().root"
      [class]="cn('relative flex w-full flex-col gap-1.5', class())"
      [attr.data-scope]="DATA_SCOPE"
      [attr.data-readonly]="readOnly() ? '' : null"
      data-part="root"
    >
      @if (label()) {
        <label
          [id]="ids().label"
          [htmlFor]="ids().input"
          [class]="
            cn(
              'flex select-none items-center gap-1 text-start font-medium text-sm',
              disabled() && 'opacity-50'
            )
          "
          [attr.data-scope]="DATA_SCOPE"
          [attr.data-disabled]="disabled() ? '' : null"
          [attr.data-invalid]="invalid() ? '' : null"
          [attr.data-readonly]="readOnly() ? '' : null"
          data-part="label"
        >
          {{ label() }}
          @if (optionalText()) {
            <ng-container *ngTemplateOutlet="optionalText()"></ng-container>
          }
          @if (required()) {
            <span class="text-[var(--color-error)]">*</span>
          }
        </label>
      }

      <!-- Content projection for input/textarea/select -->
      <ng-content></ng-content>

      @if (invalid() && errorText()) {
        <span
          [id]="ids().errorText"
          [attr.data-scope]="DATA_SCOPE"
          class="inline-flex items-center gap-1 font-medium text-[var(--color-error)] text-xs"
          aria-live="polite"
          data-part="error-text"
        >
          {{ errorText() }}
        </span>
      }

      @if (helperText()) {
        <p
          [id]="ids().helperText"
          [attr.data-scope]="DATA_SCOPE"
          class="text-xs"
          data-part="helper-text"
        >
          {{ helperText() }}
        </p>
      }
    </fieldset>
  `,
})
export class FieldComponent implements AfterContentInit, OnChanges {
  /**
   * Custom CSS class for the fieldset wrapper
   */
  class = input<string>();

  /**
   * Indicates whether the field is disabled.
   */
  disabled = input<boolean | undefined>();

  /**
   * Error text to display when field is invalid.
   */
  errorText = input<string>();

  /**
   * Helper text to display below the field.
   */
  helperText = input<string>();

  /**
   * Unique ID for the field. Auto-generated if not provided.
   */
  id = input<string>(uuid());

  /**
   * Indicates whether the field is invalid.
   */
  invalid = input<boolean | undefined>(false);

  /**
   * The label for the field.
   */
  label = input<string>();

  /**
   * Template for optional text (displayed after label).
   */
  optionalText = input<TemplateRef<unknown>>();

  /**
   * Indicates whether the field is read-only.
   */
  readOnly = input<boolean | undefined>(false);

  /**
   * Indicates whether the field is required.
   */
  required = input<boolean | undefined>(false);

  private contentInitialized = false;

  protected readonly DATA_SCOPE = DATA_SCOPE;
  protected readonly cn = cn;
  protected elementRef = inject<ElementRef<HTMLFieldSetElement>>(ElementRef);

  /**
   * Signal containing all the IDs for field elements
   */
  protected readonly ids = signal({
    root: `${DATA_SCOPE}-${this.id()}`,
    label: `${DATA_SCOPE}-${this.id()}-label`,
    input: this.id(),
    errorText: `${DATA_SCOPE}-${this.id()}-error-text`,
    helperText: `${DATA_SCOPE}-${this.id()}-helper-text`,
  });

  constructor() {
    // Auto-update when any signal changes
    effect(() => {
      if (this.contentInitialized) {
        // Track all signals
        this.disabled();
        this.invalid();
        this.required();
        this.readOnly();

        // Update input element
        this.updateInputElement();
      }
    });
  }

  ngAfterContentInit(): void {
    this.contentInitialized = true;
    this.updateInputElement();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Only update if content is already initialized (skip first render)
    if (this.contentInitialized && (changes["disabled"] || changes["invalid"] || changes["required"] || changes["readOnly"])) {
      this.updateInputElement();
    }
  }

  /**
   * Updates the attributes and classes of the projected input element
   */
  private updateInputElement(): void {
    // Find the input/textarea/select element
    const root = this.elementRef.nativeElement;
    const input = root.querySelector("input, textarea, select") as HTMLElement | null;

    if (!input) {
      return;
    }

    // Set ID
    if (this.ids().input) {
      input.id = this.ids().input;
    }

    // Set data attributes
    input.setAttribute("data-scope", DATA_SCOPE);
    input.setAttribute("data-part", "input");

    // Handle invalid state
    if (this.invalid()) {
      input.setAttribute("data-invalid", "");
      input.setAttribute("aria-invalid", "true");
    } else {
      input.removeAttribute("data-invalid");
      input.removeAttribute("aria-invalid");
    }

    // Handle disabled state
    if (this.disabled()) {
      input.setAttribute("disabled", "");
    } else {
      input.removeAttribute("disabled");
    }

    // Handle readonly state
    if (this.readOnly()) {
      input.setAttribute("readonly", "");
    } else {
      input.removeAttribute("readonly");
    }

    // Handle required state
    if (this.required()) {
      input.setAttribute("required", "");
    } else {
      input.removeAttribute("required");
    }

    // Link to error text
    if (this.invalid() && this.errorText() && this.ids().errorText) {
      input.setAttribute("aria-describedby", this.ids().errorText);
    } else if (this.helperText() && this.ids().helperText) {
      input.setAttribute("aria-describedby", this.ids().helperText);
    } else {
      input.removeAttribute("aria-describedby");
    }
  }
}
