import { Tag } from "./tag.model";
import { User } from "./user.model";
import { Comment } from "./comment.model";

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  idauthor?: number;
  authorFullName?: string;
  comments?: Comment[];
  tags?: Tag[]; // Modifiez ceci pour utiliser l'interface Tag
  imageUrl?: string;
    likesCount?: number; // 👈 ajoute cette ligne

}
