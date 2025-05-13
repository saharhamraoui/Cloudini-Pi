import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl = 'http://192.168.1.162:30596/pi/comments';

  constructor(private http: HttpClient) {}


  getPostComments(postId: number, page: number = 0, size: number = 10): Observable<any> {
    const url = `${this.baseUrl}/post/${postId}?page=${page}&size=${size}`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  createComment(postId: number, content: string, userId: number): Observable<any> {
    const url = `${this.baseUrl}/postcomment/${postId}`;
    const body = {
      content,
      authorId: userId, // Envoyez uniquement l'ID de l'utilisateur
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteComment(commentId: number, userId: number): Observable<any> {
    const url = `${this.baseUrl}/${commentId}`;
    const headers = new HttpHeaders({
      'X-User-Id': userId.toString(),
    });
    const options = { headers };
    return this.http.delete(url, options).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
