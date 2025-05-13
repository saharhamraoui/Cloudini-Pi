import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import confetti from 'canvas-confetti';
import { ChatBotService } from 'src/app/services/ChatBot/chat-bot.service';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent implements AfterViewChecked, OnInit {
  @ViewChild('chatBox') private chatBox!: ElementRef;

  // Core Properties
  userMessage: string = '';
  chatVisible: boolean = false;
  isTyping: boolean = false;
  isListening: boolean = false;
  isDarkMode: boolean = false;
  recognition: any;

  // Quick Replies
  showQuickReplies: boolean = true;
  quickReplies = [
    { emoji: '⏰', text: 'Hours of operation?' },
    { emoji: '📞', text: 'Contact support' },
    { emoji: '❓', text: 'What can you do?' }
  ];

  // Chat History
  chatHistory: {
    sender: string, 
    message: string, 
    timestamp: string,
    read?: boolean
  }[] = [];

  constructor(private chatService: ChatBotService) {}

  ngOnInit(): void {
    this.initSpeechRecognition();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  // Scroll to bottom of chat
  private scrollToBottom(): void {
    try {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch(err) { 
      console.error('Scroll error:', err);
    }
  }

  // Get formatted time
  private getCurrentTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  openChat(): void {
    this.chatVisible = true;
    if (this.chatHistory.length === 0) {
      confetti({ 
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  closeChat(): void {
    this.chatVisible = false;
  }

  sendMessage(): void {
    if (!this.userMessage.trim()) return;
    
    // Add user message
    this.chatHistory.push({ 
      sender: 'user', 
      message: this.userMessage, 
      timestamp: this.getCurrentTime(),
      read: false
    });
    
    const message = this.userMessage;
    this.userMessage = '';
    this.showQuickReplies = false;
    this.isTyping = true;

    // Simulate message read after 1s
    setTimeout(() => {
      this.chatHistory[this.chatHistory.length - 1].read = true;
    }, 1000);

    this.chatService.askQuestion(message).subscribe({
      next: (data) => {
        this.handleBotResponse(data.response);
        this.generateSuggestions();
      },
      error: (err) => {
        this.handleBotResponse("Sorry, I encountered an error. Please try again.");
      },
      complete: () => {
        this.isTyping = false;
      }
    });
  }

  private handleBotResponse(response: string): void {
    this.chatHistory.push({
      sender: 'bot',
      message: response,
      timestamp: this.getCurrentTime()
    });
    this.speak(response);
  }

  // Quick Replies
  sendQuickReply(text: string): void {
    this.userMessage = text;
    this.sendMessage();
  }

  // File Upload
  handleUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.chatHistory.push({
        sender: 'user',
        message: `[File: ${file.name}]`,
        timestamp: this.getCurrentTime()
      });
      // Here you would handle the file upload
    }
  }

  // Theme Toggle


  // Smart Suggestions
  generateSuggestions(): void {
    const lastMessage = this.chatHistory[this.chatHistory.length - 1].message.toLowerCase();
    
    if (lastMessage.includes('booking')) {
      this.quickReplies = [
        { emoji: '✏️', text: 'Modify booking' },
        { emoji: '❌', text: 'Cancel booking' }
      ];
    } else if (lastMessage.includes('contact')) {
      this.quickReplies = [
        { emoji: '📧', text: 'Email support' },
        { emoji: '📱', text: 'Call support' }
      ];
    } else {
      this.quickReplies = [
        { emoji: '⏰', text: 'Opening hours' },
        { emoji: '📍', text: 'Location' }
      ];
    }
    this.showQuickReplies = true;
  }

  // Speech Synthesis
  speak(text: string): void {
    this.stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }

  stopSpeaking(): void {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
  }

  // Speech Recognition
  private initSpeechRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || 
                            (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.userMessage = transcript;
        this.sendMessage();
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    } else {
      console.warn('Speech Recognition API not supported');
    }
  }

  startListening(): void {
    if (this.recognition && !this.isListening) {
      this.isListening = true;
      this.recognition.start();
    }
  }
}