import { Book, BookProps } from '../../../domain/entities/book.js';
import { ReadingStatus } from '../../../domain/entities/reading-status.js';
import { BookRepository } from '../../../domain/repositories/book-repository.js';
import { prisma } from '../prisma.js';

export class PrismaBookRepository implements BookRepository {
  async save(book: Book): Promise<void> {
    const data = book.toJSON();

    const dataToPersist = this.toPersistence(data);

    await prisma.book.upsert({
      where: { id: data.id },
      create: dataToPersist,
      update: dataToPersist,
    });
  }

  async findByIsbn({ isbn, userId }: { isbn: string; userId: string }): Promise<Book | null> {
    const record = await prisma.book.findFirst({
      where: { isbn, userId },
    });

    if (!record) {
      return null;
    }

    return this.toDomain(record);
  }

  private toPersistence(props: BookProps) {
    return {
      id: props.id,
      userId: props.userId,
      title: props.title,
      authors: props.authors,
      isbn: props.isbn,
      pageCount: props.pageCount,
      publishedDate: props.publishedDate,
      description: props.description,
      coverUrl: props.coverUrl,
      status: props.status,
      currentPage: props.currentPage,
      rating: props.rating,
      review: props.review,
      isLoaned: props.isLoaned,
    };
  }

  private toDomain(record: any): Book {
    return new Book({
      id: record.id,
      userId: record.userId,
      title: record.title,
      authors: record.authors,
      isbn: record.isbn,
      pageCount: record.pageCount ?? undefined,
      publishedDate: record.publishedDate ?? undefined,
      description: record.description ?? undefined,
      coverUrl: record.coverUrl ?? undefined,
      status: record.status as ReadingStatus,
      currentPage: record.currentPage,
      rating: record.rating ?? undefined,
      review: record.review ?? undefined,
      isLoaned: record.isLoaned,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
