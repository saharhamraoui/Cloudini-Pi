import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-post-create',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent {
  newPost = { title: '', content: '' };
  tagsInput = '';
  errorMessage = '';
  isLoading = false;
  selectedImageFile: File | null = null;
  selectedImagePreview: string | null = null;
  badWordsWarning = '';
  showBadWordsWarning = false;

  constructor(private blogService: BlogService, private router: Router) {}

  async checkForBadWords(): Promise<boolean> {
    const textToCheck = `${this.newPost.title} ${this.newPost.content} ${this.tagsInput}`;

    try {
      const response: any = await lastValueFrom(
        this.blogService.checkForBadWords(textToCheck)
      );

      if (response.containsProfanity) {
        this.badWordsWarning = `Votre contenu contient des mots inappropriés. Version filtrée: ${response.filteredText}`;
        this.showBadWordsWarning = true;
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking bad words:', error);
      return true;
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.newPost.title?.trim() || !this.newPost.content?.trim()) {
      this.errorMessage = 'Le titre et le contenu sont obligatoires';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.showBadWordsWarning = false;

    const isClean = await this.checkForBadWords();
    if (!isClean) {
      this.isLoading = false;
      return;
    }

    try {
      const tags = this.processTags();
      const authorId = 3;

      await lastValueFrom(
        this.blogService.createPost(
          this.newPost.title.trim(),
          this.newPost.content.trim(),
          authorId,
          tags,
        )
      );

this.router.navigate(['front/blog'], { queryParams: { created: true } });    } catch (error: any) {
      this.errorMessage = `Erreur: ${error.error?.message || error.message || 'Une erreur est survenue'}`;
    } finally {
      this.isLoading = false;
    }
  }

  private processTags(): string[] {
    return this.tagsInput
      ? this.tagsInput.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0)
      : [];
  }


}
