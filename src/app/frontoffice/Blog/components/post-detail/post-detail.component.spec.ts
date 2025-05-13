import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDetailsComponent } from './post-detail.component';

describe('PostDetailComponent', () => {
  let component: PostDetailsComponent;
  let fixture: ComponentFixture<PostDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostDetailsComponent]
    });
    fixture = TestBed.createComponent(PostDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
