import { z } from 'zod';

// File validation schemas
export const fileSchema = z.object({
  name: z.string().min(1, 'File name is required'),
  size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  type: z.string().refine(
    (type) => {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/svg+xml',
      ];
      return allowedTypes.includes(type);
    },
    { message: 'File type not supported' }
  ),
});

// IP Asset validation
export const ipAssetSchema = z.object({
  name: z.string().min(1, 'Asset name is required').max(200, 'Asset name too long'),
  type: z.enum(['patent', 'trademark', 'copyright', 'trade-secret']),
  description: z.string().max(1000, 'Description too long').optional(),
});

// Pricing validation
export const pricingRequestSchema = z.object({
  tier: z.enum(['starter', 'professional', 'enterprise']),
  assets: z.number().int().min(1, 'At least 1 asset required'),
  billing_cycle: z.enum(['monthly', 'annual']).optional(),
});

// ROI validation
export const roiRequestSchema = z.object({
  patents: z.number().int().min(0).optional(),
  trademarks: z.number().int().min(0).optional(),
  copyrights: z.number().int().min(0).optional(),
  tier: z.enum(['starter', 'professional', 'enterprise']).optional(),
});

export function validateFile(file: File): { valid: boolean; error?: string } {
  try {
    fileSchema.parse({
      name: file.name,
      size: file.size,
      type: file.type,
    });
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: 'Invalid file' };
  }
}

