/**
 * Error thrown when a language code is invalid.
 */
export class InvalidLanguageCodeError extends Error {
  /**
   * The invalid language code.
   */
  readonly code: string | null | undefined;

  constructor(code: string | null | undefined, message: string) {
    super(message);
    this.name = 'InvalidLanguageCodeError';
    this.code = code;
  }
}
