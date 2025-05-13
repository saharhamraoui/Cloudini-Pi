import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { Paiement } from 'src/app/model/Paiement';
import { PaiementService } from 'src/app/services/Paiement/paiement.service';


export interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}
@Component({
  selector: 'app-paiement-client',
  templateUrl: './paiement-client.component.html',
  styleUrls: ['./paiement-client.component.css']
})
export class PaiementClientComponent implements AfterViewInit {
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;
  selectedCard = '';

  // Payment model
  paymentDetails = {
    nomPatient: '',
    montant: 0,
    modeDePaiement: 'Carte bancaire',
    emailMedecin: '',
    datePaiement: '',
    statut: 'Payé',
    typeCarte: '', // 👈 New field
  };
  

  // Animation control variables
  paymentSuccess = false;
  processingPayment = false;
  cardFocused = false;
  errorMessage = '';
  loggedUser!: string;
  currRole!: string;

  // UI Elements
  securityBadges = [
    { icon: 'fas fa-shield-alt', text: 'Paiement sécurisé' },
    { icon: 'fas fa-lock', text: 'Chiffrement SSL' },
    { icon: 'fas fa-heart', text: 'Sans frais cachés' },
    { icon: 'fas fa-badge-check', text: 'Garantie satisfait' }
  ];

  paymentMethods = [
    { name: 'Visa', icon: 'https://img.icons8.com/color/30/visa.png', available: true },
    { name: 'Mastercard', icon: 'https://img.icons8.com/color/30/mastercard-logo.png', available: true },
    { name: 'Amex', icon: 'https://img.icons8.com/color/30/amex.png', available: true },
    { name: 'PayPal', icon: 'https://img.icons8.com/color/30/paypal.png', available: true },
    { name: 'Apple Pay', icon: 'https://img.icons8.com/ios-filled/30/apple-pay.png', available: false }
  ];

  constructor(private stripeService: PaiementService, private _router: ActivatedRoute) {}

  paiement!: Paiement;
  
  goBack() {
    window.history.back();
  }

  async ngOnInit() {

    const id = +this. _router.snapshot.paramMap.get('id')!;
  if (id) {
    this.stripeService.getPaiementById(+id).subscribe(p => {
      this.paiement = p;
    });
  }



  
    
    
    this.loggedUser = JSON.stringify(
      sessionStorage.getItem('loggedUser') || '{}'
    );
    this.loggedUser = this.loggedUser.replace(/"/g, '');

    this.currRole = JSON.stringify(sessionStorage.getItem('ROLE') || '{}');
    this.currRole = this.currRole.replace(/"/g, '');

    // Initialize Stripe
    this.stripe = await loadStripe(
      'pk_test_51REbxJIsTRWCabaqXD97ViCXWSp3JWXUm4jU3Npj5YwRRjEHbsVuXzVJGYO8FwWGAaKLWyXVFBWKFTLo9WwZFxdg00gvszT3kO'
    );

    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.cardElement = this.elements.create('card');
      this.cardElement.mount('#card-element');

      // Add focus/blur events for animations
      this.cardElement.on('focus', () => this.cardFocused = true);
      this.cardElement.on('blur', () => this.cardFocused = false);
    }
  }

  ngAfterViewInit() {
    this.initParticles();
  }

  initParticles() {
    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = window.innerWidth < 768 ? 30 : 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: `rgba(30, 129, 176, ${Math.random() * 0.2 + 0.05})`
      });
    }

    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x > canvas.width + 5 || particle.x < -5) {
          particle.speedX = -particle.speedX;
        }
        if (particle.y > canvas.height + 5 || particle.y < -5) {
          particle.speedY = -particle.speedY;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  async submitPayment() {
    if (!this.selectedCard) {
      this.errorMessage = 'Veuillez sélectionner un type de carte.';
      return;
    }
    if (!this.stripe || !this.cardElement) {
      this.errorMessage = 'Stripe initialization failed. Please refresh the page.';
      return;
    }
  
    this.processingPayment = true;
    this.errorMessage = '';
  
    try {
      const response = await this.stripeService.createPaymentIntent(this.paymentDetails).toPromise();
  
      if (response?.error) {
        this.errorMessage = response.error;
        this.processingPayment = false;
        return;
      }
  
      const clientSecret = response?.clientSecret;
      if (!clientSecret) {
        this.errorMessage = 'Failed to retrieve payment details.';
        this.processingPayment = false;
        return;
      }
  
      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.cardElement,
        },
      });
  
      if (result?.error) {
        this.errorMessage = result.error.message || 'Échec du paiement.';
        this.processingPayment = false;
      } else {
        this.paymentSuccess = true;
        this.processingPayment = false;
        this.paymentDetails.statut = 'Confirmé';
        this.launchConfetti();
  
        // 🧠 Subtract the paid amount AFTER successful payment
        this.paiement.montantPaye =this.paiement.montantPaye! + this.paymentDetails.montant
  
        this.stripeService.updatePaymentStatus(this.paiement.id!, this.paiement).subscribe(updated => {
          console.log('Paiement updated successfully:', updated);
        });
  
        // Reset form after success
        setTimeout(() => {
          this.paymentDetails = {
            nomPatient: '',
            montant: 0,
            modeDePaiement: 'Carte bancaire',
            emailMedecin: '',
            datePaiement: '',
            statut: 'Payé',
            typeCarte: '',
          };
        }, 3000);
      }
    } catch (error) {
      this.errorMessage = 'An unexpected error occurred. Please try again.';
      this.processingPayment = false;
      console.error('Payment error:', error);
    }
  }
  
  launchConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) return;

    const colors = ['#143c6a', '#1e81b0', '#4CAF50', '#FFC107', '#E91E63'];
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.opacity = '1';
      
      confettiContainer.appendChild(confetti);
      
      // Animation
      const animation = confetti.animate([
        { top: '-10px', opacity: 1, transform: `rotate(0deg)` },
        { top: '100%', opacity: 0, transform: `rotate(${Math.random() * 360}deg)` }
      ], {
        duration: 3000 + Math.random() * 2000,
        easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
      });
      
      animation.onfinish = () => confetti.remove();
    }
  }

  

  playButtonHover() {
    // You can add additional hover effects here if needed
    const btn = document.querySelector('.submit-btn');
    if (btn) {
      btn.classList.add('hover-effect');
      setTimeout(() => btn.classList.remove('hover-effect'), 500);
    }
  }


  selectCard(cardType: string) {
  this.selectedCard = cardType;
  this.paymentDetails.typeCarte = cardType; // 👈 Bind selected card

  // Optional animation
  const options = document.querySelectorAll('.card-option');
  options.forEach(option => {
    if (option.classList.contains('selected')) {
      option.classList.add('bounce');
      setTimeout(() => option.classList.remove('bounce'), 500);
    }
  });
}

}