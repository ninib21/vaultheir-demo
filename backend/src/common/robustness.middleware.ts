/**
 * Robustness Middleware for NestJS
 * Simplified version that integrates with existing ValidationPipe
 */

import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RobustnessAgent, AgentConfig, IntelligentErrorHandler, ErrorContext } from '../shared/robustness-agent';

@Injectable()
export class RobustnessMiddleware implements NestMiddleware {
  private agent: RobustnessAgent;
  private errorHandler: IntelligentErrorHandler;

  constructor() {
    const agentConfig: AgentConfig = {
      fieldCorrection: true,
      intentRecognition: true,
      suggestionGeneration: true,
      autoCorrection: false,
      learningEnabled: true,
    };

    this.agent = new RobustnessAgent(agentConfig);
    this.errorHandler = new IntelligentErrorHandler();
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Skip for GET requests without body
    if (req.method === 'GET' && !req.body) {
      return next();
    }

    // Process request asynchronously
    this.processRequest(req, res, next).catch((error) => {
      console.error('Robustness middleware error:', error);
      next(error);
    });
  }

  private async processRequest(req: Request, res: Response, next: NextFunction) {
    const endpoint = req.path;
    const method = req.method;

    // Create error context
    const context: ErrorContext = {
      endpoint,
      method,
      requestBody: req.body,
      queryParams: req.query,
      headers: req.headers,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString(),
    };

    // Step 1: Pre-validation analysis by AI Agent
    if (req.body && Object.keys(req.body).length > 0) {
      const analysis = await this.agent.analyzeRequestPattern(req.body, endpoint);

      // Step 2: Apply intelligent defaults
      const dataWithDefaults = this.agent.applyIntelligentDefaults(req.body || {}, endpoint);
      req.body = dataWithDefaults;

      // Step 3: Log potential issues (don't block, just inform)
      if (analysis.potentialIssues.length > 0) {
        console.log('Potential issues detected:', analysis.potentialIssues);
      }

      // Step 4: Log field corrections (for developer awareness)
      if (analysis.suggestedCorrections.length > 0) {
        console.log('Field name suggestions:', analysis.suggestedCorrections);
      }
    }

    // Proceed to next middleware (ValidationPipe will handle actual validation)
    next();
  }
}

