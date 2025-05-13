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
  isChatOpen = false; // Variable pour contrôler l'ouverture du chat

  constructor(private chatbotService: GeminiChatService) {}

  // Fonction pour envoyer un message
  sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({ sender: 'Vous', text: this.userInput });

    this.chatbotService.sendMessage(this.userInput).subscribe(response => {
      this.messages.push({ sender: 'Bot', text: response });
    });

    this.userInput = '';
  }

  // Ouvrir le chat
  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  // Fermer le chat
  closeChat() {
    this.isChatOpen = false;
  }

  // Scroll to the bottom of the chat when a new message is added
  ngAfterViewChecked() {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

}
