import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleSuggestionsComponent } from './Blog/components/article-suggestions-component/article-suggestions-component.component';
import { CreatePostComponent } from './Blog/components/create-post/create-post.component';
import { EditPostComponent } from './Blog/components/edit-post/edit-post.component';
import { MyPostsComponent } from './Blog/components/my-posts/my-posts.component';
import { NotificationsComponent } from './Blog/components/notifications/notifications.component';
import { PostDetailsComponent } from './Blog/components/post-detail/post-detail.component';
import { PostListComponent } from './Blog/components/post-list/post-list.component';
import { ListConsultationComponent } from './components/consultation/list-consultation/list-consultation.component';
import { DiseaseComponent } from './components/disease/disease.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ReclamationFormComponent } from './components/reclamation-form/reclamation-form.component';
import { ReclamationListComponent } from './components/reclamation-list/reclamation-list.component';
import { RegisterComponent } from './components/register/register.component';
import { AddRendezVousComponent } from './components/rendezVous/add-rendez-vous/add-rendez-vous.component';
import { ListRendezVousComponent } from './components/rendezVous/list-rendez-vous/list-rendez-vous.component';
import { UpdateRendezVousComponent } from './components/rendezVous/update-rendez-vous/update-rendez-vous.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { RoleSelectionComponent } from './components/role-selection/role-selection.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { FrontofficeComponent } from './frontoffice.component';

import { PrescriptionFrontComponent } from './components/PrescriptionFront/prescription-front/prescription-front.component';
import { MedicalRecordFrontComponent } from './components/medicalRecordFront/medical-record-front/medical-record-front.component';
import { DiscountRequestComponentComponent } from './components/paiementFront/discount-request-component/discount-request-component.component';
import { PaiementClientTnComponent } from './components/paiementFront/paiement-client-tn/paiement-client-tn.component';
import { PaiementClientComponent } from './components/paiementFront/paiement-client/paiement-client.component';
import { PaymentListComponent } from './components/paiementFront/payment-list/payment-list.component';

const routes: Routes = [
  {
    path: '',
    component: FrontofficeComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'blog', component: PostListComponent },
      { path: 'create-post', component: CreatePostComponent },
      { path: 'my-posts', component: MyPostsComponent },
      { path: 'post-detail/:id', component: PostDetailsComponent },
      { path: 'edit-post/:id', component: EditPostComponent },
      { path: 'article-suggestions', component: ArticleSuggestionsComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path:'list-rendez-vous',  component: ListRendezVousComponent},
      { path:'addRendezVous',  component: AddRendezVousComponent},
      {path: 'updaterendezvous/:id', component: UpdateRendezVousComponent },
      { path:'list-consultation',  component: ListConsultationComponent},
      { path:'disease',  component: DiseaseComponent},
      { path:'PaiementClient/:id',  component: PaiementClientComponent},
      { path:'PrescriptionClient',  component: PrescriptionFrontComponent},
      { path:'medicalRecordClient',  component: MedicalRecordFrontComponent},
      { path:'paymentList',  component: PaymentListComponent},
      { path:'paiementTn/:id',  component:PaiementClientTnComponent},
      { path: 'request-discount/:id', component: DiscountRequestComponentComponent },
      { path: 'reclamation', component: ReclamationFormComponent },
      { path: 'my-reclamations', component: ReclamationListComponent },
      { path: 'role-selection', component: RoleSelectionComponent },
      { path: 'register/:role', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'verify-email', component: VerifyEmailComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontofficeRoutingModule { }
