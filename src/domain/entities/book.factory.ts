import { Book, BookProps } from './book.js';

type CreateBookInput = Omit<
  BookProps,
  'id' | 'status' | 'currentPage' | 'isLoaned' | 'createdAt' | 'updatedAt'
>;

function createBookFactory(overrides: Partial<CreateBookInput> = {}): Book {
  return Book.create({
    userId: 'test-user',
    title: 'Test Book',
    authors: ['Test Author'],
    isbn: '0000000000000',
    ...overrides,
  });
}

export { createBookFactory };
