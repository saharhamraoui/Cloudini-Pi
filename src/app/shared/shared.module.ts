import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NlToBrPipe } from '../pipes/nl-to-br.pipe';

@NgModule({
  declarations: [
    NlToBrPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NlToBrPipe
  ]
})
export class SharedModule { } 