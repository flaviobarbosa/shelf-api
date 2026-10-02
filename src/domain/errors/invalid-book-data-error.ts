export class InvalidBookDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBookDataError';
  }
}
