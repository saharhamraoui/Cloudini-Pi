import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BilanService } from 'src/app/services/Bilan/bilan.service';

@Component({
  selector: 'app-bilan-upload',
  templateUrl: './bilan-upload.component.html',
  styleUrls: ['./bilan-upload.component.css']
})
export class BilanUploadComponent {
  bilanForm: FormGroup;
  selectedFile: File | null = null;
  uploadSuccess: boolean=false;
  @Input() medicalRecordId?: number | null;
  @Output() bilanUploaded = new EventEmitter<void>(); // Add this line

  constructor(private fb: FormBuilder, private bilanService: BilanService) {
    this.bilanForm = this.fb.group({
      type: [''],
      results: [''],
      medicalRecordId: [1] // Use dynamic value if needed
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (!this.selectedFile) {
      alert('Please select a file.');
      return;
    }
    this.uploadSuccess=true;
    const formData = new FormData();
    formData.append('type', this.bilanForm.get('type')?.value);
    formData.append('results', this.bilanForm.get('results')?.value);
    formData.append('file', this.selectedFile);
    formData.append('medicalRecordId', this.medicalRecordId?.toString() || '');

    this.bilanService.addBilan(formData).subscribe({
      next: () => {
        alert('Bilan uploaded successfully!');
        this.bilanForm.reset();
        this.selectedFile = null;
        this.bilanUploaded.emit(); // Emit the event after successful upload
      },
      error: (err) => {
        console.error(err);
        alert('Upload failed.');
      }
    });
  }
}