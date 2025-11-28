/**
 * Base Validation Schema for VaultHeir™ APIs
 * Provides foundation for predictable robustness
 */

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions?: string[];
  correctedData?: any;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
  documentation?: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  suggestion?: string;
}

export interface SchemaDefinition {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  strictRequired: string[];
  flexibleOptional: string[];
  agentEnhanced?: {
    fieldCorrection: boolean;
    intentRecognition: boolean;
    suggestionGeneration: boolean;
  };
  validationRules: ValidationRule[];
}

export interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'url' | 'enum' | 'array' | 'object';
  required: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  enum?: any[];
  customValidator?: (value: any) => boolean;
  errorMessage?: string;
  correctionHint?: string;
}

export class BaseValidationSchema {
  protected schema: SchemaDefinition;

  constructor(schema: SchemaDefinition) {
    this.schema = schema;
  }

  /**
   * Validate data against schema with intelligent error handling
   */
  validate(data: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const correctedData: any = { ...data };

    // Check required fields
    for (const field of this.schema.strictRequired) {
      if (!(field in data) || data[field] === null || data[field] === undefined) {
        errors.push({
          field,
          message: `Field '${field}' is required`,
          code: 'REQUIRED_FIELD_MISSING',
          severity: 'error',
          suggestion: `Please provide a value for '${field}'`,
        });
      }
    }

    // Validate each field
    for (const rule of this.schema.validationRules) {
      const value = correctedData[rule.field];

      // Skip if optional and not provided
      if (!rule.required && (value === undefined || value === null)) {
        continue;
      }

      // Type validation
      const typeError = this.validateType(value, rule);
      if (typeError) {
        errors.push(typeError);
        continue;
      }

      // Range validation
      if (rule.type === 'number' || rule.type === 'string') {
        const rangeError = this.validateRange(value, rule);
        if (rangeError) {
          errors.push(rangeError);
        }
      }

      // Pattern validation
      if (rule.pattern && rule.type === 'string') {
        const patternError = this.validatePattern(value, rule);
        if (patternError) {
          errors.push(patternError);
        }
      }

      // Enum validation
      if (rule.enum && !rule.enum.includes(value)) {
        errors.push({
          field: rule.field,
          message: `Value '${value}' is not allowed. Allowed values: ${rule.enum.join(', ')}`,
          code: 'INVALID_ENUM_VALUE',
          severity: 'error',
          suggestion: `Use one of: ${rule.enum.join(', ')}`,
        });
      }

      // Custom validation
      if (rule.customValidator && !rule.customValidator(value)) {
        errors.push({
          field: rule.field,
          message: rule.errorMessage || `Validation failed for field '${rule.field}'`,
          code: 'CUSTOM_VALIDATION_FAILED',
          severity: 'error',
          suggestion: rule.correctionHint,
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      correctedData: errors.length === 0 ? correctedData : undefined,
    };
  }

  private validateType(value: any, rule: ValidationRule): ValidationError | null {
    const typeMap: Record<string, (v: any) => boolean> = {
      string: (v) => typeof v === 'string',
      number: (v) => typeof v === 'number' && !isNaN(v),
      boolean: (v) => typeof v === 'boolean',
      date: (v) => v instanceof Date || !isNaN(Date.parse(v)),
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      url: (v) => {
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      array: (v) => Array.isArray(v),
      object: (v) => typeof v === 'object' && v !== null && !Array.isArray(v),
    };

    if (rule.type === 'number' && typeof value === 'string' && !isNaN(Number(value))) {
      // Auto-convert numeric strings
      return null;
    }

    const validator = typeMap[rule.type];
    if (!validator || !validator(value)) {
      return {
        field: rule.field,
        message: `Field '${rule.field}' must be of type ${rule.type}`,
        code: 'TYPE_MISMATCH',
        severity: 'error',
        suggestion: `Expected ${rule.type}, got ${typeof value}`,
      };
    }

    return null;
  }

  private validateRange(value: any, rule: ValidationRule): ValidationError | null {
    if (rule.type === 'number') {
      const num = typeof value === 'string' ? Number(value) : value;
      if (rule.min !== undefined && num < rule.min) {
        return {
          field: rule.field,
          message: `Field '${rule.field}' must be at least ${rule.min}`,
          code: 'MIN_VALUE_VIOLATION',
          severity: 'error',
          suggestion: `Use a value >= ${rule.min}`,
        };
      }
      if (rule.max !== undefined && num > rule.max) {
        return {
          field: rule.field,
          message: `Field '${rule.field}' must be at most ${rule.max}`,
          code: 'MAX_VALUE_VIOLATION',
          severity: 'error',
          suggestion: `Use a value <= ${rule.max}`,
        };
      }
    } else if (rule.type === 'string') {
      if (rule.min !== undefined && value.length < rule.min) {
        return {
          field: rule.field,
          message: `Field '${rule.field}' must be at least ${rule.min} characters`,
          code: 'MIN_LENGTH_VIOLATION',
          severity: 'error',
          suggestion: `Use at least ${rule.min} characters`,
        };
      }
      if (rule.max !== undefined && value.length > rule.max) {
        return {
          field: rule.field,
          message: `Field '${rule.field}' must be at most ${rule.max} characters`,
          code: 'MAX_LENGTH_VIOLATION',
          severity: 'error',
          suggestion: `Use at most ${rule.max} characters`,
        };
      }
    }
    return null;
  }

  private validatePattern(value: string, rule: ValidationRule): ValidationError | null {
    if (!rule.pattern) return null;
    const regex = new RegExp(rule.pattern);
    if (!regex.test(value)) {
      return {
        field: rule.field,
        message: `Field '${rule.field}' does not match required pattern`,
        code: 'PATTERN_MISMATCH',
        severity: 'error',
        suggestion: rule.correctionHint || 'Please check the format',
      };
    }
    return null;
  }
}

