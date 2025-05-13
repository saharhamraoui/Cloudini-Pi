import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { CommentService } from '../../services/comment.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

interface PostResponse {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorFullName: string;
  comments?: any[];
}

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post.scss']
})
export class PostDetailsComponent implements OnInit {
  post: PostResponse | null = null;
  isLoading = true;
  errorMessage = '';
  commentContent = '';
  isSubmittingComment = false;
  safeImageUrl: SafeUrl | null = null;

  constructor(
    private blogService: BlogService,
    private commentService: CommentService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const postId = this.getPostId();
    if (postId) {
      this.loadPost(postId);
    }
  }

  private getPostId(): number | null {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? Number(id) : null;
  }

  private loadPost(postId: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.blogService.getPostWithAuthorName(postId)
      .pipe(
        catchError(error => {
          console.error('Error loading post:', error);
          this.errorMessage = 'Failed to load post';
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(post => {
        this.post = post;
        if (post) {
          this.loadComments(postId);
        }
      });
  }



  private loadComments(postId: number): void {
    this.commentService.getPostComments(postId)
      .pipe(
        catchError(error => {
          console.error('Error loading comments:', error);
          return of([]);
        })
      )
      .subscribe(comments => {
        if (this.post) {
          this.post.comments = comments;
        }
      });
  }

  addComment(): void {
    const content = this.commentContent.trim();
    if (!content || !this.post) return;

    this.isSubmittingComment = true;
    const userId = 3;

    this.commentService.createComment(this.post.id, content, userId)
      .pipe(
        finalize(() => this.isSubmittingComment = false)
      )
      .subscribe({
        next: comment => {
          this.post!.comments = this.post!.comments || [];
          this.post!.comments.push(comment);
          this.commentContent = '';
        },
        error: err => {
          console.error('Error adding comment:', err);
          this.errorMessage = 'Failed to add comment';
        }
      });
  }
}
