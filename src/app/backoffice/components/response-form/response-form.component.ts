import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseModel } from 'src/app/model/response.model';
import { ResponseService } from 'src/app/services/response.service';

@Component({
  selector: 'app-response-form',
  templateUrl: './response-form.component.html'
})
export class ResponseFormComponent {
  @Input() reclamationId!: number;
  form: FormGroup;

  constructor(private fb: FormBuilder, private responseService: ResponseService) {
    this.form = this.fb.group({ message: ['', Validators.required] });
  }

  submit(): void {
    const response: ResponseModel = {
      message: this.form.value.message,
      reclamationId: this.reclamationId
    };
    this.responseService.createResponse(this.reclamationId, response).subscribe(() => {
      this.form.reset();
    });
  }
}
