import { Component } from '@angular/core';
import { AiService } from '../../services/api-service.service';
import { HttpErrorResponse } from '@angular/common/http';

const MEDICAL_SPECIALTIES = [
  'Medicine', 'Surgery', 'Cardiology', 'Neurology', 'Pediatrics',
  'Oncology', 'Dermatology', 'Psychiatry', 'Radiology', 'Gynecology',
  'Anesthesiology', 'Endocrinology', 'Geriatrics', 'Hematology',
  'Nephrology', 'Ophthalmology', 'ENT', 'Pulmonology', 'Rheumatology',
  'Urology', 'Internal Medicine', 'General Medicine', 'Immunology',
  'Infectious Diseases', 'Emergency Medicine', 'Public Health'
];

const MEDICAL_KEYWORDS = [
  'cancer', 'diabetes', 'cardiac arrest', 'stroke', 'tumor', 'therapy', 'genetics',
  'breast cancer', 'heart failure', 'asthma', 'depression', 'infection', 'surgery',
  'neurology', 'oncology', 'pediatrics', 'epidemiology', 'pharmacology', 'anemia',
  'arthritis', 'cardiology', 'radiology', 'urology', 'gynecology'
];

@Component({
  selector: 'app-article-suggestions',
  templateUrl: './article-suggestions-component.component.html',
  styleUrls: ['./article-suggestions-component.component.scss']
})
export class ArticleSuggestionsComponent {
  specialty: string = '';
  keywords: string = '';
  suggestions: any[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  medicalSpecialties = MEDICAL_SPECIALTIES;

  constructor(private aiService: AiService) {}

  getSuggestions(): void {
    if (!this.isValidSpecialty(this.specialty)) {
      this.errorMessage = 'Please select a valid medical specialty.';
      return;
    }

    if (!this.isValidKeywords(this.keywords)) {
      this.errorMessage = 'Please enter valid medical keywords.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.suggestions = [];

    this.aiService.suggestArticles(this.specialty, this.keywords).subscribe({
      next: (response) => {
        try {
          const allSuggestions = this.parseSuggestions(response) || [];

          this.suggestions = allSuggestions
            .filter(article =>
              article.title && article.summary &&
              !article.title.includes('Veuillez noter') &&
              !article.summary.includes('Veuillez noter')
            )
            .slice(0, 2); // Take only 2 articles

        } catch (e) {
          this.errorMessage = 'Error parsing the suggestions.';
          console.error(e);
        }
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.handleError(error);
        this.isLoading = false;
      }
    });
  }

  private isValidSpecialty(specialty: string): boolean {
    return MEDICAL_SPECIALTIES.includes(specialty);
  }

  private isValidKeywords(keywords: string): boolean {
    const lowerKeywords = keywords.toLowerCase();
    return MEDICAL_KEYWORDS.some(keyword => lowerKeywords.includes(keyword));
  }

  private parseSuggestions(response: any): any[] {
    const textResponse = response?.articles || '';

    // Remove introductory text if present
    const cleanedResponse = textResponse.replace(/^.*?(?=\d+\.)/, '').trim();

    // Split articles and clean each one
    const rawArticles = cleanedResponse.split(/\n\n(?=\d+\.)/)
      .filter((item: string) => item.trim())
      .map((article: string) => {
        // Extract article number, title and content
        const match = article.match(/^(\d+)\.\s*(.*?)\n(.*)/s);
        return match ? {
          id: parseInt(match[1]),
          title: match[2].trim(),
          summary: match[3].trim(),
          importance: 'Relevant to the specialty',
          resources: this.generateResources(match[2].trim())
        } : null;
      })
      .filter((article: any) => article !== null);

    return rawArticles;
  }

  private generateResources(title: string): any[] {
    return [
      {
        name: 'Google Scholar',
        icon: 'fa-graduation-cap',
        url: `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`
      },
      {
        name: 'PubMed',
        icon: 'fa-dna',
        url: `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(title)}`
      },
      {
        name: 'ResearchGate',
        icon: 'fa-flask',
        url: `https://www.researchgate.net/search?q=${encodeURIComponent(title)}`
      },
      {
        name: 'SpringerLink',
        icon: 'fa-book-open',
        url: `https://link.springer.com/search?query=${encodeURIComponent(title)}`
      }
    ];
  }

  private handleError(error: HttpErrorResponse): void {
    console.error('HTTP Error:', error);
    if (error.status === 0) {
      this.errorMessage = 'Server connection error.';
    } else if (error.status >= 400 && error.status < 500) {
      this.errorMessage = error.error?.error || 'Invalid request.';
    } else {
      this.errorMessage = 'Server error, please try again later.';
    }
  }
}
