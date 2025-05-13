import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare var AOS: any;
declare var GLightbox: any;
declare var Swiper: any;
declare var bootstrap: any;

@Component({
  selector: 'app-frontoffice',
  templateUrl: './frontoffice.component.html',
  styleUrls: ['./frontoffice.component.css']
})
export class FrontofficeComponent implements OnInit, OnDestroy, AfterViewInit {
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Add body class
    document.body.classList.add('index-page');

    // Initialize libraries on route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => {
        this.initializeJS();
      }, 100);
    });

    // Initial initialization
    setTimeout(() => {
      this.initializeJS();
    }, 500);
  }

  ngAfterViewInit(): void {
    // Initialize scroll top functionality
    this.initScrollTop();
    
    // Handle preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.style.visibility = 'hidden';
        preloader.style.opacity = '0';
      }, 1000);
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 1500);
    }
  }

  ngOnDestroy(): void {
    // Remove body class on component destruction
    document.body.classList.remove('index-page');
  }

  private initScrollTop(): void {
    const scrollTop = document.getElementById('scroll-top');
    if (scrollTop) {
      // Toggle visibility based on scroll position
      const toggleScrollTop = () => {
        if (window.scrollY > 100) {
          scrollTop.classList.add('active');
        } else {
          scrollTop.classList.remove('active');
        }
      };

      // Add scroll event listener
      window.addEventListener('scroll', toggleScrollTop);
      
      // Add click event listener for smooth scrolling to top
      scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
      
      // Initial check
      toggleScrollTop();
    }
  }

  private initializeJS(): void {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }

    // Initialize GLightbox
    if (typeof GLightbox !== 'undefined') {
      const glightbox = GLightbox({
        selector: '.glightbox'
      });
    }

    // Initialize Bootstrap components
    if (typeof bootstrap !== 'undefined') {
      // Initialize dropdowns
      const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
      const dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl);
      });

      // Initialize tooltips
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }

    // Initialize hero carousel
    const heroCarouselElement = document.getElementById('hero-carousel');
    if (heroCarouselElement && typeof bootstrap !== 'undefined') {
      new bootstrap.Carousel(heroCarouselElement, {
        interval: 5000,
        ride: true
      });
    }

    // Initialize other carousels/swipers
    if (document.querySelector('.swiper')) {
      new Swiper('.swiper', {
        speed: 400,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        }
      });
    }
  }
}
