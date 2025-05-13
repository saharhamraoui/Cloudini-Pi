// src/app/back-office/Blog/components/post-form/post-form.component.ts
import { Component } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css'],
})
export class PostFormComponent {
  title: string = ''; // Titre du post
  content: string = ''; // Contenu du post

  doctorName : string = ""
constructor(private router: Router,private blogService: BlogService) {}
ngOnInit(): void {
  this.doctorName = this.blogService.getDoctorName();
}
  onSubmit(): void {
    if (!this.title || !this.content) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    // Appel au service pour créer un post
    this.blogService.createPost(this.title, this.content).subscribe(
      (response) => {
        console.log('Post créé avec succès :', response);
        alert('Post créé avec succès !');
      },
      (error) => {
        console.error('Erreur lors de la création du post :', error);
        alert('Erreur lors de la création du post.');
      }
    );

    // Réinitialisation du formulaire
    this.title = '';
    this.content = '';
  }
}
