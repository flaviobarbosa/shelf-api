import { randomUUID, randomUUIDv7 } from 'node:crypto';
import { ReadingStatus } from './reading-status.js';
import { InvalidBookStatusTransitionError } from '../errors/invalid-book-status-transition.error.js';

export interface BookProps {
  id: string;
  userId: string;
  title: string;
  authors: string[];
  isbn: string;
  pageCount?: number;
  publishedDate?: string;
  description?: string;
  coverUrl?: string;
  status: ReadingStatus;
  currentPage: number;
  rating?: number;
  review?: string;
  isLoaned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Book {
  private props: BookProps;

  constructor(props: BookProps) {
    this.props = props;
  }

  static create(
    props: Omit<
      BookProps,
      'id' | 'status' | 'currentPage' | 'isLoaned' | 'createdAt' | 'updatedAt'
    >,
  ): Book {
    return new Book({
      ...props,
      id: randomUUID(),
      status: ReadingStatus.WANT_TO_READ,
      currentPage: 0,
      isLoaned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get status() {
    return this.props.status;
  }

  get isLoaned() {
    return this.props.isLoaned;
  }

  changeStatus(newStatus: ReadingStatus): void {
    if (this.props.isLoaned && newStatus === ReadingStatus.READING) {
      throw new InvalidBookStatusTransitionError('Cannot mark a loaned book as reading');
    }

    if (newStatus === ReadingStatus.READ && this.props.status !== ReadingStatus.READING) {
      throw new InvalidBookStatusTransitionError(
        'A book must be in "reading" status before being marked as read',
      );
    }

    this.props.status = newStatus;
    this.props.updatedAt = new Date();
  }

  updateProgress(newPage: number): void {
    if (this.props.status !== ReadingStatus.READING) {
      throw new InvalidBookStatusTransitionError(
        'Cannot update progress on a book that is not being read',
      );
    }

    if (newPage < this.props.currentPage) {
      throw new InvalidBookStatusTransitionError(
        'New page must be greater than the current page number',
      );
    }

    if (this.props.pageCount && newPage > this.props.pageCount) {
      throw new InvalidBookStatusTransitionError('Current page cannot exceed total page count');
    }

    this.props.currentPage = newPage;
    this.props.updatedAt = new Date();
  }

  addReview(rating: number, review?: string): void {
    if (this.props.status !== ReadingStatus.READ) {
      throw new InvalidBookStatusTransitionError('Can only review a book after it has been read');
    }

    if (rating < 1 || rating > 5) {
      throw new InvalidBookStatusTransitionError('Rating must be between 1 and 5');
    }

    this.props.rating = rating;
    this.props.review = review;
    this.props.updatedAt = new Date();
  }

  markAsLoaned(): void {
    this.props.isLoaned = true;
    this.props.updatedAt = new Date();
  }

  markAsReturned(): void {
    this.props.isLoaned = false;
    this.props.updatedAt = new Date();
  }

  toJSON(): BookProps {
    return { ...this.props };
  }
}
