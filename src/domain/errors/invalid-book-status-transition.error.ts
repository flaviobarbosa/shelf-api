export class InvalidBookStatusTransitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBookStatusTransitionError';
  }
}
