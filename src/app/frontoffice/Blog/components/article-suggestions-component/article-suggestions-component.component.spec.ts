import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSuggestionsComponentComponent } from './article-suggestions-component.component';

describe('ArticleSuggestionsComponentComponent', () => {
  let component: ArticleSuggestionsComponentComponent;
  let fixture: ComponentFixture<ArticleSuggestionsComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleSuggestionsComponentComponent]
    });
    fixture = TestBed.createComponent(ArticleSuggestionsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
