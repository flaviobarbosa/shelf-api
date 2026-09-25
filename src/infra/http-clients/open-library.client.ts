export interface OpenLibraryResponse {
  title?: string;
  number_of_pages?: number;
  covers?: number[];
}

export async function fetchFromOpenLibrary(isbn: string): Promise<OpenLibraryResponse | null> {
  const response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`, {
    headers: {
      'User-Agent': 'shelf-api (seu-email@gmail.com)',
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Open Library request failed with status ${response.status}`);
  }

  const json = await response.json();

  return {
    title: json.title,
    number_of_pages: json.number_of_pages,
    covers: json.covers,
  };
}
