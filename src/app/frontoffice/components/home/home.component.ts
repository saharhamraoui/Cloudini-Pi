import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

declare var bootstrap: any;
declare var Swiper: any;
declare var GLightbox: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
  private scrollListener: any;

  ngOnInit(): void {
    document.body.classList.add('index-page');
    
    // Initialize scroll event listener for fixed header
    this.initScrollListener();
  }

  ngAfterViewInit(): void {
    // Initialize Bootstrap carousel with a delay to ensure the DOM is fully loaded
    setTimeout(() => {
      this.initCarousel();
      this.initTabs();
      this.initSwipers();
      this.initLightbox();
      this.initFaqAccordion();
    }, 500);
  }
  
  ngOnDestroy(): void {
    document.body.classList.remove('index-page');
    
    // Remove scroll event listener
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  private initScrollListener(): void {
    this.scrollListener = () => {
      const header = document.querySelector('.header') as HTMLElement;
      if (header) {
        if (window.scrollY > 100) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }
      }
    };
    
    window.addEventListener('scroll', this.scrollListener);
    
    // Trigger initially in case page is refreshed while scrolled
    this.scrollListener();
  }

  private initCarousel(): void {
    try {
      // Get the carousel element
      const carouselElement = document.getElementById('hero-carousel');
      
      if (carouselElement && typeof bootstrap !== 'undefined') {
        // Initialize Bootstrap carousel
        const carousel = new bootstrap.Carousel(carouselElement, {
          interval: 5000,
          ride: true,
          wrap: true,
          touch: true
        });
        
        console.log('Carousel initialized successfully');
        
        // Fix for navigation arrows
        const prevButton = document.querySelector('.carousel-control-prev');
        const nextButton = document.querySelector('.carousel-control-next');
        
        if (prevButton) {
          prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            carousel.prev();
          });
        }
        
        if (nextButton) {
          nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            carousel.next();
          });
        }
        
        // Fix for indicators
        const indicators = document.querySelectorAll('.carousel-indicators li');
        if (indicators.length > 0) {
          indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (event) => {
              event.preventDefault();
              carousel.to(index);
            });
          });
        }
      } else {
        console.warn('Carousel element not found or Bootstrap not loaded');
      }
    } catch (error) {
      console.error('Error initializing carousel:', error);
    }
  }

  private initTabs(): void {
    try {
      if (typeof bootstrap !== 'undefined') {
        // Initialize tabs
        const tabLinks = document.querySelectorAll('.nav-tabs .nav-link');
        tabLinks.forEach(tabLink => {
          tabLink.addEventListener('click', (event) => {
            event.preventDefault();
            const tab = new bootstrap.Tab(tabLink);
            tab.show();
          });
        });
        
        console.log('Tabs initialized successfully');
      } else {
        console.warn('Bootstrap not loaded for tabs');
      }
    } catch (error) {
      console.error('Error initializing tabs:', error);
    }
  }

  private initSwipers(): void {
    try {
      if (typeof Swiper !== 'undefined') {
        // Initialize testimonials swiper
        const testimonialsSwiper = new Swiper('.testimonials-swiper', {
          speed: 600,
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false
          },
          slidesPerView: 'auto',
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
          },
          breakpoints: {
            320: {
              slidesPerView: 1,
              spaceBetween: 40
            },
            1200: {
              slidesPerView: 3,
              spaceBetween: 20
            }
          }
        });

        // Initialize gallery swiper
        const gallerySwiper = new Swiper('.gallery-swiper', {
          speed: 600,
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false
          },
          slidesPerView: 'auto',
          centeredSlides: true,
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
          },
          breakpoints: {
            320: {
              slidesPerView: 1,
              spaceBetween: 0
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20
            },
            1200: {
              slidesPerView: 5,
              spaceBetween: 20
            }
          }
        });
        
        console.log('Swipers initialized successfully');
      } else {
        console.warn('Swiper not loaded');
      }
    } catch (error) {
      console.error('Error initializing swipers:', error);
    }
  }

  private initLightbox(): void {
    try {
      if (typeof GLightbox !== 'undefined') {
        // Initialize GLightbox
        const lightbox = GLightbox({
          selector: '.glightbox',
          touchNavigation: true,
          loop: true,
          autoplayVideos: true
        });
        
        console.log('Lightbox initialized successfully');
      } else {
        console.warn('GLightbox not loaded');
      }
    } catch (error) {
      console.error('Error initializing lightbox:', error);
    }
  }

  private initFaqAccordion(): void {
    try {
      // Initialize FAQ accordion
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach(item => {
        const faqToggle = item.querySelector('.faq-toggle');
        if (faqToggle) {
          faqToggle.addEventListener('click', () => {
            item.classList.toggle('faq-active');
          });
        }
      });
      
      console.log('FAQ accordion initialized successfully');
    } catch (error) {
      console.error('Error initializing FAQ accordion:', error);
    }
  }
}
