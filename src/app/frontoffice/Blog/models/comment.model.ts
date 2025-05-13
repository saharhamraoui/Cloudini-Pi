export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  author: {
    idUser: number;
    firstName: string;
    lastName: string;
  };
}
