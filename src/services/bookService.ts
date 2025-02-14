export interface IBook {
    id: number;
    title: string;
    isbn: string;
    publicationDate: Date;
    description: string;
    pages: number;
    amount: number;
    edition: number;
    publishierId: number;
}