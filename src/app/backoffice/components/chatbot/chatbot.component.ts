import { Component } from '@angular/core';
import { GeminiChatService } from 'src/app/services/gemini-chat.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userInput = '';
  botResponse: string | null = null;

  constructor(private chatbotService: GeminiChatService) {}

  askGemini() {
    if (!this.userInput.trim()) return;

    this.chatbotService.sendMessage(this.userInput).subscribe(
      (response) => {
        this.botResponse = response;  // Handle response from Gemini
      },
      (error) => {
        console.error('Error:', error);
        this.botResponse = 'Sorry, there was an error.';
      }
    );
  }
}