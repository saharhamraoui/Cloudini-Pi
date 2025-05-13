import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AiAssistantService } from 'src/app/services/ai-assistant.service';

interface Message {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface UserInfo {
  name?: string;
  lastVisit?: Date;
}

@Component({
  selector: 'app-assist-onalert',
  templateUrl: './assist-onalert.component.html',
  styleUrls: ['./assist-onalert.component.css']
})
export class AssistOnalertComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages') private chatMessages!: ElementRef;
  @ViewChild('scrollBottom') private scrollBottom!: ElementRef;
  
  isOpen = false;
  isTyping = false;
  messages: Message[] = [];
  messageInput = new FormControl('', Validators.required);
  userInfo: UserInfo = {};
  private shouldScroll = false;
  
  // Define assistant's capabilities
  private assistantCapabilities = [
    "Help you find a doctor based on specialty",
    "Guide you through making an appointment",
    "Provide information about our medical services",
    "Answer questions about our departments",
    "Give information about our doctors",
    "Explain medical procedures offered at our clinic",
    "Provide clinic hours and contact information",
    "Recommend doctors based on appointment popularity",
    "Help with basic health information"
  ];
  
  constructor(private aiService: AiAssistantService) { }

  ngOnInit(): void {
    // Load saved messages and user info from sessionStorage
    this.loadSessionData();
    
    // If no previous messages, initialize with welcome message
    if (this.messages.length === 0) {
      this.addBotMessage('Hello! I\'m assist-onalert, your medical assistant. How can I help you today?');
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => {
        this.shouldScroll = true;
      }, 100);
    }
  }

  sendMessage(): void {
    if (!this.messageInput.value?.trim()) return;
    
    const userMessage = this.messageInput.value.trim();
    this.addUserMessage(userMessage);
    this.messageInput.reset();
    
    // Set typing indicator
    this.isTyping = true;
    this.shouldScroll = true;
    
    // Check for user name in message
    this.checkForUserName(userMessage);
    
    // Check for specific questions with canned responses
    if (this.handleSpecificQuestions(userMessage)) {
      return; // Question was handled, no need to send to API
    }
    
    // Regular API interaction for other queries
    // Prepare message context with user info
    const contextMessage = this.prepareContextMessage(userMessage);
    
    // Regular AI response
    this.aiService.sendMessage(contextMessage).subscribe(
      (response) => {
        setTimeout(() => {
          this.isTyping = false;
          // Replace any generic AI identity statements
          const processedResponse = this.processAIResponse(response);
          this.addBotMessage(processedResponse);
        }, 1000); // Simulated typing delay
      },
      (error) => {
        setTimeout(() => {
          this.isTyping = false;
          this.addBotMessage('Sorry, I couldn\'t process your request. Please try again.');
        }, 1000);
      }
    );
  }

  private handleSpecificQuestions(message: string): boolean {
    const lowerMsg = message.toLowerCase();
    
    // What's your name
    if (lowerMsg.includes('what') && 
        (lowerMsg.includes('your name') || lowerMsg.includes('ur name'))) {
      setTimeout(() => {
        this.isTyping = false;
        this.addBotMessage('My name is assist-onalert. I\'m your medical assistant here to help you with appointments and medical information.');
      }, 1000);
      return true;
    }
    
    // What's my name
    if (lowerMsg.match(/what('s| is) my name/i) || lowerMsg === "my name") {
      setTimeout(() => {
        this.isTyping = false;
        if (this.userInfo.name) {
          this.addBotMessage(`Your name is ${this.userInfo.name}. How can I assist you today?`);
        } else {
          this.addBotMessage("I don't know your name yet. Would you mind sharing it with me?");
        }
      }, 1000);
      return true;
    }
    
    // What can you do / capabilities
    if (lowerMsg.match(/what (can|could) you do/i) || 
        lowerMsg.includes('what you can do') || 
        lowerMsg.includes('your capabilities') || 
        lowerMsg.includes('help me with')) {
      
      setTimeout(() => {
        this.isTyping = false;
        
        let response = this.userInfo.name ? 
          `${this.userInfo.name}, here's what I can help you with:\n\n` : 
          "Here's what I can help you with:\n\n";
          
        response += this.assistantCapabilities.map(cap => `• ${cap}`).join('\n');
        response += '\n\nHow can I assist you today?';
        
        this.addBotMessage(response);
      }, 1000);
      return true;
    }
    
    // Recommend doctor request
    if (lowerMsg.includes('recommend') && 
        lowerMsg.includes('doctor')) {
      // Get doctor recommendations
      this.aiService.getDoctorRecommendations().subscribe(
        (response) => {
          setTimeout(() => {
            this.isTyping = false;
            this.addBotMessage(response);
          }, 1000); // Simulated typing delay
        },
        (error) => {
          setTimeout(() => {
            this.isTyping = false;
            this.addBotMessage('Sorry, I couldn\'t get doctor recommendations at this time.');
          }, 1000);
        }
      );
      return true;
    }
    
    // Office hours
    if (lowerMsg.includes('hours') || 
        lowerMsg.includes('when are you open') || 
        lowerMsg.includes('opening time')) {
      setTimeout(() => {
        this.isTyping = false;
        this.addBotMessage('Our clinic is open Monday through Saturday, from 8AM to 10PM. How else can I help you?');
      }, 1000);
      return true;
    }
    
    // Contact information
    if (lowerMsg.includes('contact') || 
        lowerMsg.includes('phone') || 
        lowerMsg.includes('call') || 
        lowerMsg.includes('number')) {
      setTimeout(() => {
        this.isTyping = false;
        this.addBotMessage('You can contact our clinic at +1 5589 55488 55. Our address is A108 Adam Street, New York, NY 535022. Is there anything specific you\'d like to know?');
      }, 1000);
      return true;
    }
    
    // Make appointment
    if (lowerMsg.includes('appointment') || 
        lowerMsg.includes('schedule') || 
        lowerMsg.includes('book')) {
      setTimeout(() => {
        this.isTyping = false;
        this.addBotMessage('To make an appointment, you can:\n\n1. Click the "Make an Appointment" button at the top of the page\n2. Fill out the appointment form in the Appointment section\n3. Call us directly at +1 5589 55488 55\n\nDo you have a specific doctor or department in mind?');
      }, 1000);
      return true;
    }
    
    return false; // No matches found
  }

  private checkForUserName(message: string): void {
    const namePatterns = [
      /my name is (\w+)/i,
      /i am (\w+)/i,
      /i'm (\w+)/i,
      /call me (\w+)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        this.userInfo.name = match[1];
        this.saveSessionData();
        break;
      }
    }
  }
  
  private prepareContextMessage(userMessage: string): string {
    // Prepare a context-rich message for the AI
    let context = '';
    
    // Add user context if available
    if (this.userInfo.name) {
      context += `The user's name is ${this.userInfo.name}. Please address them by name in your response. `;
    }
    
    // Add capabilities context to avoid generic AI responses
    context += `You are assist-onalert, a medical assistant for Medicio clinic. `;
    context += `You can help with: ${this.assistantCapabilities.join(', ')}. `;
    context += `Be brief and healthcare-focused in your responses. `;
    
    // Add the actual user query
    context += `User message: ${userMessage}`;
    
    return context;
  }
  
  private processAIResponse(response: string): string {
    // Replace generic AI identity statements
    const replacements = [
      {
        pattern: /I am a large language model|I'm an AI|I'm a language model|I am an assistant created by|created by Google|trained by Google|developed by Google/gi,
        replacement: "I am assist-onalert, your medical assistant"
      },
      {
        pattern: /As an AI|As a language model|As an assistant/gi,
        replacement: "As assist-onalert"
      },
      {
        pattern: /I don't have the ability to|I cannot|I don't have access to|I'm unable to access/gi,
        replacement: "I'm not able to"
      }
    ];
    
    let processedResponse = response;
    for (const { pattern, replacement } of replacements) {
      processedResponse = processedResponse.replace(pattern, replacement);
    }
    
    // Add personalization if we know the user's name
    if (this.userInfo.name && !processedResponse.includes(this.userInfo.name)) {
      if (Math.random() > 0.7) { // Occasionally add the name for natural conversation
        const sentences = processedResponse.split(/[.!?]\s+/);
        if (sentences.length > 1) {
          const randomIndex = Math.floor(Math.random() * (sentences.length - 1));
          sentences[randomIndex] = `${this.userInfo.name}, ${sentences[randomIndex].toLowerCase()}`;
          processedResponse = sentences.join('. ').replace(/\.\./g, '.');
        } else {
          processedResponse = `${this.userInfo.name}, ${processedResponse.toLowerCase()}`;
        }
      }
    }
    
    return processedResponse;
  }

  private addUserMessage(content: string): void {
    this.messages.push({
      content,
      sender: 'user',
      timestamp: new Date()
    });
    this.saveSessionData();
    this.shouldScroll = true;
  }

  private addBotMessage(content: string): void {
    this.messages.push({
      content,
      sender: 'bot',
      timestamp: new Date()
    });
    this.saveSessionData();
    this.shouldScroll = true;
  }

  private saveSessionData(): void {
    try {
      // Save messages and user info to sessionStorage
      const sessionData = {
        messages: this.messages,
        userInfo: this.userInfo
      };
      sessionStorage.setItem('assist-onalert-data', JSON.stringify(sessionData));
    } catch (err) {
      console.error('Error saving chat session:', err);
    }
  }
  
  private loadSessionData(): void {
    try {
      const sessionDataString = sessionStorage.getItem('assist-onalert-data');
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        this.messages = sessionData.messages || [];
        this.userInfo = sessionData.userInfo || {};
      }
    } catch (err) {
      console.error('Error loading chat session:', err);
      // If there's an error, start fresh
      this.messages = [];
      this.userInfo = {};
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollBottom) {
        this.scrollBottom.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      } else if (this.chatMessages) {
        this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
} 