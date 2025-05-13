import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Post } from '../../models/post.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.scss']
})
export class MyPostsComponent implements OnInit {
  posts: Post[] = [];
  allPosts: Post[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  currentUserId: number = 3;
  currentPage: number = 1;
  totalPages: number = 1;
  postsPerPage: number = 6;

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllPosts();
  }

  loadAllPosts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.blogService.getPostsByAuthor(this.currentUserId).subscribe({
      next: (data: Post[]) => {
        this.allPosts = data;
        this.totalPages = Math.ceil(data.length / this.postsPerPage);
        this.updatePaginatedPosts();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.errorMessage = this.getErrorMessage(error);
        this.isLoading = false;

        // Chargement de données de test en cas d'échec
        if (this.allPosts.length === 0) {
          this.loadSampleData();
        }
      }
    });
  }

  private updatePaginatedPosts(): void {
    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    this.posts = this.allPosts.slice(startIndex, endIndex);
  }

  private getErrorMessage(error: any): string {
    if (error.status === 404) {
      return "Vous n'avez aucun post pour le moment.";
    } else if (error.status === 0) {
      return "Impossible de se connecter au serveur.";
    } else {
      return "Une erreur est survenue lors du chargement des posts.";
    }
  }

  private loadSampleData(): void {
    this.allPosts = [
      {
        id: 1,
        title: 'Mon premier post',
        content: 'Ceci est un exemple de contenu pour votre premier post...',
        createdAt: new Date(),
        authorFullName: 'Dr. Test',
        tags: [{ id: 1, name: 'médecine' }]
      },
      {
        id: 2,
        title: 'Un autre post',
        content: 'Un autre exemple de contenu pour démontrer la fonctionnalité...',
        createdAt: new Date(),
        authorFullName: 'Dr. Test',
        tags: [{ id: 2, name: 'santé' }]
      }
    ];
    this.totalPages = Math.ceil(this.allPosts.length / this.postsPerPage);
    this.updatePaginatedPosts();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedPosts();
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  editPost(postId: number): void {
    this.router.navigate(['front/edit-post', postId]);
  }

  deletePost(postId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      this.blogService.deletePost(postId , 3).subscribe({
        next: () => {
          this.allPosts = this.allPosts.filter(post => post.id !== postId);
          this.totalPages = Math.ceil(this.allPosts.length / this.postsPerPage);
          this.updatePaginatedPosts();
        },
        error: (error) => {
          console.error('Error deleting post:', error);
          alert('Échec de la suppression. Veuillez réessayer.');
        }
      });
    }
  }

  viewPostDetails(postId: number): void {
    this.router.navigate(['front/post-detail', postId]);
  }
}
