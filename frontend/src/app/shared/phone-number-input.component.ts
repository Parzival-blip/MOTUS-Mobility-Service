import { Component, forwardRef } from "@angular/core";
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from "@angular/forms";

type PhoneNumberLib = typeof import("libphonenumber-js/min");

@Component({
  selector: "motus-phone-number-input",
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneNumberInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PhoneNumberInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="phone-input-shell" [class.phone-input-shell-disabled]="disabled">
      <span class="phone-fixed-prefix" aria-hidden="true">+91</span>
      <input
        class="phone-number-field"
        type="tel"
        name="tel"
        inputmode="tel"
        autocomplete="tel"
        [value]="displayValue"
        [placeholder]="placeholder"
        [disabled]="disabled"
        (input)="onInput($event)"
        (change)="onInput($event)"
        (blur)="onBlur()"
        (focus)="onFocus()"
      >
    </div>
  `
})
export class PhoneNumberInputComponent implements ControlValueAccessor, Validator {
  displayValue = "";
  disabled = false;
  focused = false;

  private normalizedValue = "";
  private touched = false;
  private phoneNumberLib: PhoneNumberLib | null = null;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  get placeholder(): string {
    return "98765 43210";
  }

  writeValue(value: string | null): void {
    const normalized = this.normalizeIndianMobile(value ?? "");
    this.normalizedValue = normalized.e164;

    if (!normalized.e164) {
      this.displayValue = "";
      return;
    }

    this.displayValue = this.formatIndianMobile(normalized.national);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    if (!this.displayValue.trim()) {
      return null;
    }

    return this.normalizedValue ? null : { phoneNumber: true };
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.setPhoneValue(input.value, false);
  }

  onFocus(): void {
    this.focused = true;
    void this.loadPhoneNumberLib();
  }

  onBlur(): void {
    this.focused = false;
    this.touched = true;
    this.onTouched();

    void this.formatNormalizedValue();
  }

  private setPhoneValue(value: string, formatDisplay: boolean): void {
    const normalized = this.normalizeIndianMobile(value);

    if (normalized.e164) {
      this.normalizedValue = normalized.e164;
      this.displayValue = formatDisplay ? this.formatIndianMobile(normalized.national) : normalized.national;
      this.onChange(normalized.e164);
      void this.confirmWithLibPhoneNumber(normalized.e164);
      return;
    }

    this.normalizedValue = "";
    this.displayValue = value;
    this.onChange("");
  }

  private async formatNormalizedValue(): Promise<void> {
    if (!this.normalizedValue) {
      return;
    }

    const normalized = this.normalizeIndianMobile(this.normalizedValue);
    this.displayValue = normalized.national ? this.formatIndianMobile(normalized.national) : this.displayValue;
  }

  private normalizeIndianMobile(value: string): { e164: string; national: string } {
    const digits = value.replace(/\D/g, "");
    const national = digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;

    if (/^[6-9]\d{9}$/.test(national)) {
      return { e164: `+91${national}`, national };
    }

    return { e164: "", national: "" };
  }

  private formatIndianMobile(national: string): string {
    return national.length === 10 ? `${national.slice(0, 5)} ${national.slice(5)}` : national;
  }

  private async confirmWithLibPhoneNumber(e164: string): Promise<void> {
    const phoneNumberLib = await this.loadPhoneNumberLib();
    const parsed = phoneNumberLib.parsePhoneNumberFromString(e164, "IN");

    if (!parsed?.isValid() || parsed.country !== "IN") {
      this.normalizedValue = "";
      this.onChange("");
    }
  }

  private async loadPhoneNumberLib(): Promise<PhoneNumberLib> {
    if (this.phoneNumberLib) {
      return this.phoneNumberLib;
    }

    this.phoneNumberLib = await import("libphonenumber-js/min");
    return this.phoneNumberLib;
  }
}
