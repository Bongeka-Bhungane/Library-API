export interface Book {
    id: number;
    title: string;
    year: number;
    authorId: number;
}

export const books: Book[] = [];