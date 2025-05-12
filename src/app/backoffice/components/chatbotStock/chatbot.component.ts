import { AfterViewChecked, Component } from '@angular/core';
import { GeminiChatService } from 'src/app/services/gemini-chat.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {
  messages: { sender: string, text: string }[] = [];
  userInput = '';
  isChatOpen = false; 

  constructor(private chatbotService: GeminiChatService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({ sender: 'Vous', text: this.userInput });

    this.chatbotService.sendMessage(this.userInput).subscribe(response => {
      this.messages.push({ sender: 'Bot', text: response });
    });

    this.userInput = '';
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  closeChat() {
    this.isChatOpen = false;
  }

  ngAfterViewChecked() {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

}
