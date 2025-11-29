import { describe, expect, it } from '@jest/globals';
import { validateFile } from './validation';

const mockFile = (overrides?: Partial<File>): File =>
  ({
    name: 'demo.pdf',
    size: 1024,
    type: 'application/pdf',
    ...overrides,
  } as File);

describe('validateFile', () => {
  it('accepts a valid file payload', () => {
    const result = validateFile(mockFile());
    expect(result).toEqual({ valid: true });
  });

  it('rejects unsupported mime types', () => {
    const result = validateFile(mockFile({ type: 'application/x-sh' }));
    expect(result.valid).toBe(false);
    expect(result.error).toBe('File type not supported');
  });

  it('rejects files that exceed the size limit', () => {
    const result = validateFile(mockFile({ size: 20 * 1024 * 1024 }));
    expect(result.valid).toBe(false);
    expect(result.error).toBe('File size must be less than 10MB');
  });
});

