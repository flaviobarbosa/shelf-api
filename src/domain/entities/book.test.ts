import { describe, expect, it } from 'vitest';
import { createBookFactory } from './book.factory.js';
import { ReadingStatus } from './reading-status.js';
import { InvalidBookStatusTransitionError } from '../errors/invalid-book-status-transition.error.js';
import { InvalidBookDataError } from '../errors/invalid-book-data-error.js';

describe('Book', () => {
  it('should create a book with default values', () => {
    const book = createBookFactory();

    expect(book.id).toBeDefined();
    expect(book.status).toBe(ReadingStatus.WANT_TO_READ);
    expect(book.isLoaned).toBe(false);
  });

  it('should mark book as loaned', () => {
    const book = createBookFactory();
    book.markAsLoaned();

    expect(book.isLoaned).toBe(true);
  });

  it('should mark book as returned', () => {
    const book = createBookFactory();
    book.markAsLoaned();
    book.markAsReturned();

    expect(book.isLoaned).toBe(false);
  });

  it('should block moving status to READING when book is loaned', () => {
    const loanedBook = createBookFactory();
    loanedBook.markAsLoaned();

    expect(() => loanedBook.changeStatus(ReadingStatus.READING)).toThrow(
      new InvalidBookStatusTransitionError('Cannot mark a loaned book as reading'),
    );
  });

  it('should block moving status to READ without being in READING', () => {
    const book = createBookFactory();

    expect(() => book.changeStatus(ReadingStatus.READ)).toThrow(
      new InvalidBookStatusTransitionError(
        'A book must be in "reading" status before being marked as read',
      ),
    );
  });

  it('should block update progress when status is not READING', () => {
    const book = createBookFactory();

    expect(() => book.updateProgress(1)).toThrow(
      new InvalidBookStatusTransitionError(
        'Cannot update progress on a book that is not being read',
      ),
    );
  });

  it('should block page regression', () => {
    const book = createBookFactory({ pageCount: 100 });
    book.changeStatus(ReadingStatus.READING);
    book.updateProgress(30);

    expect(() => book.updateProgress(10)).toThrow(
      new InvalidBookStatusTransitionError('New page must be greater than the current page number'),
    );
  });

  it('should block page beyond page count', () => {
    const book = createBookFactory({ pageCount: 50 });
    book.changeStatus(ReadingStatus.READING);

    expect(() => book.updateProgress(51)).toThrow(
      new InvalidBookStatusTransitionError('Current page cannot exceed total page count'),
    );
  });

  it('should block review when book status is not READ', () => {
    const book = createBookFactory();

    expect(() => book.addReview(3, 'here goes the review')).toThrow(
      new InvalidBookStatusTransitionError('Can only review a book after it has been read'),
    );
  });

  it('should not allow review rating less then 1', () => {
    const book = createBookFactory();
    book.changeStatus(ReadingStatus.READING);
    book.changeStatus(ReadingStatus.READ);

    expect(() => book.addReview(0)).toThrow(
      new InvalidBookStatusTransitionError('Rating must be between 1 and 5'),
    );
  });

  it('should not allow review greater than 5', () => {
    const book = createBookFactory();
    book.changeStatus(ReadingStatus.READING);
    book.changeStatus(ReadingStatus.READ);

    expect(() => book.addReview(6)).toThrow(
      new InvalidBookStatusTransitionError('Rating must be between 1 and 5'),
    );
  });

  it('should not allow page count less then 1', () => {
    expect(() => createBookFactory({ pageCount: 0 })).toThrow(
      new InvalidBookDataError('Page count must be greater than zero'),
    );
  });
});
