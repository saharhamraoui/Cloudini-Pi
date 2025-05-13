import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  post: Post = {
    id: 0,
    title: '',
    content: '',
    createdAt: new Date(),
    authorFullName: ''
  };
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService
  ) {}
ngOnInit(): void {
  const postId = +this.route.snapshot.paramMap.get('id')!;
  this.loadPost(postId);
}

loadPost(postId: number): void {
  this.isLoading = true;
  this.blogService.getPostById(postId).subscribe({
    next: (data: Post) => {
      this.post = data;
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error fetching post details:', error);
      this.errorMessage = 'Failed to load post details.';
      this.isLoading = false;
    }
  });
}

updatePost(): void {
  const currentUserId = 3; // À remplacer par l'ID réel de l'utilisateur connecté
this.blogService.updatePost(this.post.id, this.post, currentUserId).subscribe(response => console.log(response));

  console.log('Updating post with ID:', this.post.id); // Log pour vérifier l'ID
  console.log('Updated post data:', this.post); // Log pour vérifier les données envoyées

  this.blogService.updatePost(this.post.id, this.post, 3).subscribe({
    next: () => {
      alert('Post updated successfully.');
      this.router.navigate(['/my-posts']);
    },
    error: (error) => {
      console.error('Error updating post:', error);
      if (error.status === 404) {
        alert('Post not found.');
      } else if (error.status === 400) {
        alert('Bad request. Please check the data.');
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  });

}
}
