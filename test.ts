// scratch.ts
import { fetchFromGoogleBooks } from './src/infra/http-clients/google-books.client.ts';

const result = await fetchFromGoogleBooks('9780134685991');
console.log(result);
