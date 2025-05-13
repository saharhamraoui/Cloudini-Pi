import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'nlToBr'
})
export class NlToBrPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): any {
    if (!value) {
      return '';
    }
    
    // Replace newlines with <br> tags
    const formattedText = value.replace(/\n/g, '<br>');
    
    // Return sanitized HTML
    return this.sanitizer.bypassSecurityTrustHtml(formattedText);
  }
} 