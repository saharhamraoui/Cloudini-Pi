import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { RecaptchaModule } from 'ng-recaptcha';
import { WebcamModule } from 'ngx-webcam';
import { SharedModule } from '../shared/shared.module';
import { ArticleSuggestionsComponent } from './Blog/components/article-suggestions-component/article-suggestions-component.component';
import { CreatePostComponent } from './Blog/components/create-post/create-post.component';
import { EditPostComponent } from './Blog/components/edit-post/edit-post.component';
import { MyPostsComponent } from './Blog/components/my-posts/my-posts.component';
import { NotificationsComponent } from './Blog/components/notifications/notifications.component';
import { PostDetailsComponent } from './Blog/components/post-detail/post-detail.component';
import { PostListComponent } from './Blog/components/post-list/post-list.component';
import { AssistOnalertComponent } from './components/assist-onalert/assist-onalert.component';
import { BilanListComponent } from './components/BilanFront/bilan-list/bilan-list.component';
import { BilanUploadComponent } from './components/BilanFront/bilan-upload/bilan-upload.component';
import { ListConsultationComponent } from './components/consultation/list-consultation/list-consultation.component';
import { DiseaseComponent } from './components/disease/disease.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { FooterFrontComponent } from './components/footer-front/footer-front.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HeaderFrontComponent } from './components/header-front/header-front.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MedicalRecordFrontComponent } from './components/medicalRecordFront/medical-record-front/medical-record-front.component';
import { DiscountRequestComponentComponent } from './components/paiementFront/discount-request-component/discount-request-component.component';
import { PaiementClientTnComponent } from './components/paiementFront/paiement-client-tn/paiement-client-tn.component';
import { PaiementClientComponent } from './components/paiementFront/paiement-client/paiement-client.component';
import { PaymentListComponent } from './components/paiementFront/payment-list/payment-list.component';
import { PrescriptionFrontComponent } from './components/PrescriptionFront/prescription-front/prescription-front.component';
import { ReclamationFormComponent } from './components/reclamation-form/reclamation-form.component';
import { ReclamationListComponent } from './components/reclamation-list/reclamation-list.component';
import { RegisterComponent } from './components/register/register.component';
import { AddRendezVousComponent } from './components/rendezVous/add-rendez-vous/add-rendez-vous.component';
import { ListRendezVousComponent } from './components/rendezVous/list-rendez-vous/list-rendez-vous.component';
import { UpdateRendezVousComponent } from './components/rendezVous/update-rendez-vous/update-rendez-vous.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { RoleSelectionComponent } from './components/role-selection/role-selection.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { FrontofficeRoutingModule } from './frontoffice-routing.module';
import { FrontofficeComponent } from './frontoffice.component';



const calendarRootModule = CalendarModule.forRoot({
  provide: DateAdapter,
  useFactory: adapterFactory,
});

@NgModule({
  declarations: [
    FrontofficeComponent,
    AddRendezVousComponent,
    ListRendezVousComponent,
    UpdateRendezVousComponent,
    ListConsultationComponent,
    HomeComponent,
    FooterFrontComponent,
    HeaderFrontComponent,
    AssistOnalertComponent,
    PostListComponent,
      CreatePostComponent,
      MyPostsComponent,
      EditPostComponent,
      PostDetailsComponent,
    NotificationsComponent,
  ArticleSuggestionsComponent,
    DiseaseComponent,
    PaymentListComponent,
    BilanUploadComponent,
    BilanListComponent,
    PaiementClientComponent,
    PaiementClientTnComponent,
    ReclamationFormComponent,
    ReclamationListComponent,
    RoleSelectionComponent,
    RegisterComponent,
    LoginComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    UserProfileComponent,
    EditProfileComponent,
    VerifyEmailComponent,
    PrescriptionFrontComponent,
    MedicalRecordFrontComponent,
    DiscountRequestComponentComponent
    


  ],
  imports: [
    RecaptchaModule,
    CommonModule,
    FrontofficeRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    WebcamModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    
  ]
})
export class FrontofficeModule { }
