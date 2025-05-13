import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { CommentService } from '../../services/comment.service';
import { Post } from '../../models/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Tag } from '../../models/tag.model';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post.scss']
})
export class PostListComponent implements OnInit {
  isDoctor = true;
  posts: Post[] = [];
  allTags: Tag[] = [];
  isLoading = true;
  errorMessage = '';
  currentPage = 1;
  totalPages = 1;
  searchTerm = '';
  currentUserId = 3;
  commentContents: { [postId: number]: string } = {};
  showSuccessMessage = false;
  filteredPosts: Post[] = [];
  likes: { [postId: number]: number } = {};
  likesCount: { [postId: number]: number } = {};
userLikes: { [postId: number]: boolean } = {};
isTogglingLike: { [postId: number]: boolean } = {};
isLiking: { [postId: number]: boolean } = {};  constructor(
    private blogService: BlogService,
    private commentService: CommentService,
    private route: ActivatedRoute,
    private router: Router
) { }



   ngOnInit(): void {
    this.checkForSuccessNotification();
    this.loadAllTags();

    this.route.params.subscribe(params => {
      const tagName = params['tag'];
      if (tagName) {
        this.filterByTag(tagName);
      } else {
        this.loadPosts();
      }
    });

  }



  likePost(post: Post): void {
  if (!post.id || this.isLiking[post.id]) return;

  this.isLiking[post.id] = true;

  this.blogService.likePost(post.id,this.currentUserId).subscribe({
next: (response) => {
  this.likesCount[post.id] = response.likesCount;
  this.isLiking[post.id] = false;
  this.showLikeAnimation(post.id);
},

    error: (err) => {
      console.error('Error liking post:', err);
      this.isLiking[post.id] = false;
    }
  });
}

  private showLikeAnimation(postId: number): void {
  const likeBtn = document.querySelector(`[data-post-id="${postId}"] .btn-like`);
  if (likeBtn) {
    likeBtn.classList.add('liked');
    setTimeout(() => {
      likeBtn.classList.remove('liked');
    }, 500);
  }
  }


toggleLike(post: Post): void {
  if (!post.id || this.isTogglingLike[post.id]) return;

  this.isTogglingLike[post.id] = true;

  // Mise à jour optimiste (optionnel)
  const oldCount = this.likesCount[post.id] || 0;
  this.likesCount[post.id] = oldCount + (this.isPostLiked(post.id) ? -1 : 1);

  this.blogService.toggleLike(post.id, this.currentUserId).subscribe({
    next: (response) => {
      if (response.success) {
        this.likesCount[post.id] = response.likesCount;
      } else {
        // Annule la mise à jour optimiste en cas d'échec
        this.likesCount[post.id] = oldCount;
      }
    },
    error: () => {
      this.likesCount[post.id] = oldCount; // Rollback
    },
    complete: () => {
      this.isTogglingLike[post.id] = false;
    }
  });
}
isPostLiked(postId: number): boolean {
  return this.userLikes[postId] = !this.userLikes[postId];
}


  private checkForSuccessNotification(): void {
    this.route.queryParams.subscribe(params => {
      if (params['postCreated'] === 'true') {
        this.showSuccessMessage = true;
        setTimeout(() => this.showSuccessMessage = false, 3000);
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
      }
    });
  }



loadPosts(): void {
    this.isLoading = true;
    this.blogService.getAllPosts().subscribe({
      next: (data: Post[]) => {
        this.posts = data;
        this.filteredPosts = [...this.posts];

        // Initialise les compteurs
        data.forEach(post => {
          if (post.id) {
            this.likesCount[post.id] = post.likesCount || 0;
          }
        });

        this.loadCommentsForPosts();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.errorMessage = 'Failed to load posts. Please try again later.';
        this.isLoading = false;
      }
    });
  }


private async loadAllLikes(): Promise<void> {
  for (const post of this.posts) {
    if (post.id) {
      try {
const count = await lastValueFrom(this.blogService.getLikesCount(post.id));
        this.likes[post.id] = count || 0;
      } catch (error) {
        console.error(`Error loading likes for post ${post.id}:`, error);
        this.likes[post.id] = 0;
      }
    }
  }
}
  loadAllTags(): void {
    this.blogService.getAllTags().subscribe({
      next: (tags: Tag[]) => {
        this.allTags = tags;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tags :', error);
      }
    });
  }

  filterByTag(tagName: string): void {
  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: { tag: tagName },
    queryParamsHandling: 'merge'
  });

  this.isLoading = true;
  this.blogService.getPostsByTag(tagName).subscribe({
    next: (filteredPosts: Post[]) => {
      this.posts = filteredPosts;
      this.filteredPosts = [...filteredPosts];
      this.totalPages = Math.ceil(filteredPosts.length / 5);
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Erreur lors du filtrage par tag:', error);
      this.isLoading = false;
    }
  });
  }
  clearTagFilter(): void {
  this.router.navigate([], {
    queryParams: { tag: null },
    queryParamsHandling: 'merge'
  });
  this.loadPosts();
}

  private loadCommentsForPosts(): void {
    this.posts.forEach(post => {
      if (post.id) {
        this.commentService.getPostComments(post.id).subscribe({
          next: (response: any) => {
            post.comments = response.content || [];
          },
          error: (error) => {
            console.error('Erreur lors du chargement des commentaires :', error);
            post.comments = [];
          }
        });
        this.commentContents[post.id] = '';
      }
    });
    this.isLoading = false;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get pages(): number[] {
    const totalPages = Math.ceil(this.filteredPosts.length / 5);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
navigateToCreatePost(): void {
  this.router.navigate(['/front/create-post']); // ✅ Chemin absolu complet
}

  addComment(postId: number): void {
    const content = this.commentContents[postId]?.trim();
    if (!content) {
      alert('Le commentaire ne peut pas être vide.');
      return;
    }

    this.commentService.createComment(postId, content, this.currentUserId).subscribe({
      next: (comment) => {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
          post.comments = [...(post.comments || []), comment];
          this.commentContents[postId] = '';
        }
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du commentaire :', error);
        alert('Impossible d\'ajouter le commentaire. Veuillez réessayer.');
      }
    });
  }

  performSearch(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredPosts = [...this.posts];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredPosts = this.posts.filter(post =>
        post.title.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term)
      );
    }

    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredPosts.length / 5);
  }

  viewSuggestedTopics(): void {
    this.router.navigate(['front/article-suggestions']);
  }
    viewPostDetails(postId: number): void {
    this.router.navigate(['front/post-detail', postId]);
  }
}
