  // Validation
  interface Validatable {
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    max?: number;
    min?: number;
  }

  export interface ValidatableNumber extends Validatable {
    value: number;
  }

  export interface ValidatableString extends Validatable {
    value: string;
  }

  export function validate(validatableInput: ValidatableNumber | ValidatableString) {
    let isValid = true;
    if (validatableInput.required) {
      isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
      // != checks if null or undefined
      isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
      isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
      isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
      isValid = isValid && validatableInput.value >= validatableInput.min;
    }

    return isValid;
  }
