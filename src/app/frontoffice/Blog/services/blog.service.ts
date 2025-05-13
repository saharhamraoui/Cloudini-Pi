import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Post } from '../models/post.model';

interface ToggleLikeResponse {
  success: boolean;
  likesCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://192.168.1.162:30596/pi/posts';
  private tagsApiUrl = 'http://192.168.1.162:30596/pi/tags';

  createPost(
    title: string,
    content: string,
    authorId: number,
    tags: string[],
  ): Observable<any> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('authorId', authorId.toString());
    if (tags.length > 0) formData.append('tags', JSON.stringify(tags));

    return this.http.post(`${this.apiUrl}/create-with-image`, formData);
  }


  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/getallposts`);
  }

  addTagsBulk(postId: number, tagNames: string[]): Observable<Post> {
    return this.http.post<Post>(
      `${this.apiUrl}/${postId}/tags/bulk`,
      tagNames,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }

  deletePost(postId: number, authorId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}`, {
      headers: new HttpHeaders({ userId: authorId.toString() }),
    });
  }
 checkForBadWords(text: string): Observable<any> {
    return this.http.post(`http://192.168.1.162:30596/pi/content-moderation/check`, { text });
  }

updatePost(postId: number, post: Post, userId: number) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-User-Id': userId.toString() // <- Envoyez le userId dans le header
  });

  return this.http.put<Post>(
    `${this.apiUrl}/updatepostbyid/${postId}`,
    { title: post.title, content: post.content }, // Body simplifié
    { headers }
  );
}

  getPostById(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/getbyid/${postId}`);
  }

  getAllTags(): Observable<any[]> {
    return this.http.get<any[]>(`${this.tagsApiUrl}/tags`);
  }

  getPostWithAuthorName(postId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getauthorname/${postId}`);
  }

  getPostsByAuthor(authorId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/getpostbyauthor/${authorId}`);
  }

  getPostsByTag(tagName: string): Observable<Post[]> {
    return this.http.get<Post[]>(
      `${this.apiUrl}/tagged/${encodeURIComponent(tagName)}`
    );
  }

  likePost(postId: number, userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${postId}/like`, { userId })
      .pipe(
        catchError(error => {
          console.error('Error liking post:', error);
          return throwError(() => new Error('Failed to like post'));
        })
      );
  }

  dislikePost(postId: number, userId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${postId}/dislike/${userId}`,
      {} // Body vide car les données passent dans l'URL
    ).pipe(
      catchError(error => {
        console.error('Error disliking post:', error);
        return throwError(() => new Error('Failed to dislike post'));
      })
    );
  }

  toggleLike(postId: number, userId: number): Observable<ToggleLikeResponse> {
    return this.http.post<ToggleLikeResponse>(
      `${this.apiUrl}/${postId}/toggle-like/${userId}`,
      {}
    ).pipe(
      catchError(error => {
        console.error('Error toggling like:', error);
        return throwError(() => new Error('Failed to toggle like'));
      })
    );
  }

  getLikesCount(postId: number): Observable<number> {
    return this.http.get<{likesCount: number}>(`${this.apiUrl}/getLikesForPost/${postId}`).pipe(
      map((response: {likesCount: number}) => response.likesCount),
      catchError(error => {
        console.error('Error getting likes count:', error);
        return of(0);
      })
    );
  }

}
