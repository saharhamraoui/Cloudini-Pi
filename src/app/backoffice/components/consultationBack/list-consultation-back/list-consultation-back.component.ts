import { RendezVous } from './../../../../model/RendezVous';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Consultation } from 'src/app/model/Consultation';
import { ConsultationService } from 'src/app/services/consultation.service';

@Component({
  selector: 'app-list-consultation-back',
  templateUrl: './list-consultation-back.component.html',
  styleUrls: ['./list-consultation-back.component.css']
})
export class ListConsultationBackComponent {
title = 'projectPi';
  listConsultation: any=[] ;
  selectedQRCodeRecordId: number | null = null;



  constructor(private consultationService:ConsultationService ,private router:Router){}

  ngOnInit(): void {
    this.getConsultation();
   }

   getConsultation(){
    this.consultationService.getConsultation().subscribe(
      (donnes:Consultation[])=>{
        console.log("Réponse de l'API :", donnes);
        this.listConsultation=donnes;
      },
      (erreur:HttpErrorResponse)=>{
        console.log('Erreur de l\'API :',erreur);
      }

    );
  }

    supprimerConsultation(id:any)
    {
      id=Number(id)
      this.consultationService.deleteConsultation(id).subscribe(
        data =>{
          console.log(data)
          console.log("deleted")
          this.listConsultation = this.listConsultation.filter((consultation: Consultation) => consultation.idConsultation !== id);

        },
        error=>{
          console.log(error)
        }
      )
    }

    modifierConsultation(id:any)
    {
      id=Number(id)
      this.router.navigate(['/back/updateConsultationBack',id])
    }

    toggleQRCode(recordId: number | undefined): void {
      if (this.selectedQRCodeRecordId === recordId) {
        this.selectedQRCodeRecordId = null;
      } else {
        this.selectedQRCodeRecordId = recordId ?? null;
      }
    }

    getQRCodeData(record: Consultation): string {
      const notes = record.medicalRecord?.notes
        ? record.medicalRecord.notes.substring(0, 100) + '...'
        : 'Aucune note';

      const diagnosis = record.medicalRecord?.diagnosis || 'N/A';

      const createdAt = record.medicalRecord?.createdAt
        ? new Date(record.medicalRecord.createdAt).toLocaleDateString()
        : 'N/A';

      const RendezVousDate = record.rendezVous.dateRendezVous
        ? new Date(record.rendezVous.dateRendezVous).toLocaleDateString()
        : 'N/A';

      return `--- DOSSIER MÉDICAL ---
    ID Consultation: ${record.idConsultation ?? 'N/A'}
    Date Consultation: ${RendezVousDate}

    Date Création Dossier: ${createdAt}
    Diagnostic: ${diagnosis}
    Notes: ${notes}`;
    }





  }






