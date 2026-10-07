import { Book } from '../entities/book.js';

export interface BookRepository {
  save(book: Book): Promise<void>;
  findByIsbn({ isbn, userId }: { isbn: string; userId: string }): Promise<Book | null>;
}
