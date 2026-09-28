import 'dotenv/config';
import { BookExternalData } from './types.js';

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

export async function fetchFromGoogleBooks(isbn: string): Promise<BookExternalData | null> {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${API_KEY}`,
  );

  if (response.status === 429) {
    throw new Error('Google Books rate limit exceeded. Try again later.');
  }

  if (!response.ok) {
    throw new Error(`Google Books request failed with status ${response.status}`);
  }

  const raw = await response.json();

  if (!raw.items || raw.items.length === 0) {
    return null;
  }

  const volumeInfo = raw.items[0].volumeInfo;

  return {
    title: volumeInfo?.title,
    authors: volumeInfo?.authors,
    pageCount: volumeInfo?.pageCount,
    publishedDate: volumeInfo?.publishedDate,
    description: volumeInfo?.description,
    coverUrl: volumeInfo?.imageLinks?.thumbnail,
  };
}
