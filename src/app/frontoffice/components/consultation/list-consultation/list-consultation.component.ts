
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Consultation } from 'src/app/model/Consultation';
import { ConsultationService } from 'src/app/services/consultation.service';
import { jsPDF } from 'jspdf';
@Component({
  selector: 'app-list-consultation',
  templateUrl: './list-consultation.component.html',
  styleUrls: ['./list-consultation.component.css']
})
export class ListConsultationComponent {

  title = 'projectPi';
  listConsultation: any=[] ;



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


  generatePdf(consultation: any) {
    const doc = new jsPDF();

    const primaryColor = '#0e5551';
    const titleY = 20;
    const leftX = 20;
    const rightX = 110;
    let currentY = titleY + 10;

    doc.setFontSize(22);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Rapport de Consultation Médicale', 105, titleY, { align: 'center' });

    doc.setLineWidth(0.5);
    doc.setDrawColor(primaryColor);
    doc.line(15, titleY + 5, 195, titleY + 5);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(`ID Consultation : ${consultation.idConsultation}`, leftX, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date : ${new Date(consultation.dateConsultation).toLocaleString()}`, rightX, currentY);
    currentY += 15;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text('Détails du Rendez-vous', leftX, currentY);
    currentY += 8;

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('Date du Rendez-vous :', leftX, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(
      consultation.rendezVous ? new Date(consultation.rendezVous.dateRendezVous).toLocaleString() : 'Non défini',
      leftX + 50,
      currentY
    );
    currentY += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Diagnostic :', leftX, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(
      consultation.medicalRecord?.diagnosis || 'Non défini',
      leftX + 50,
      currentY
    );
    currentY += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Rapport :', leftX, currentY);
    doc.setFont('helvetica', 'normal');

    const rapportLines = doc.splitTextToSize(consultation.rapport || 'Aucun rapport fourni', 160);
    doc.text(rapportLines, leftX + 10, currentY + 7);
    currentY += rapportLines.length * 7;

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'italic');
    doc.text('(Rapport confidentiel à usage médical)', 105, 275, { align: 'center' });

    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bolditalic');
    doc.text('Prenez soin de votre santé !', 105, 285, { align: 'center' });

    const fileName = `consultation-${consultation.idConsultation}.pdf`;
    doc.save(fileName);
  }


}
