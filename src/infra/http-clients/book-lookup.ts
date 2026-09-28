import { fetchFromGoogleBooks } from './google-books.client.js';
import { fetchFromOpenLibrary } from './open-library.client.js';
import type { BookExternalData } from './types.js';

export async function lookupBookByIsbn(isbn: string): Promise<BookExternalData | null> {
  const googleData = await fetchFromGoogleBooks(isbn);
  const openLibraryData = await fetchFromOpenLibrary(isbn);

  if (!googleData && !openLibraryData) {
    return null;
  }

  return {
    title: googleData?.title ?? openLibraryData?.title,
    authors: googleData?.authors,
    pageCount: googleData?.pageCount ?? openLibraryData?.pageCount,
    publishedDate: googleData?.publishedDate,
    description: googleData?.description,
    coverUrl: googleData?.coverUrl ?? openLibraryData?.coverUrl,
  };
}
