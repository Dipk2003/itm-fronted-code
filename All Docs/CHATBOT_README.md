# ChatBot Integration Documentation

## Overview
The ChatBot feature has been successfully integrated into your iTech platform, connecting the React frontend with your Spring Boot backend.

## Features
- 🤖 **AI-powered responses** - Intelligent product and vendor recommendations
- 🎯 **Smart vendor matching** - Finds the best vendors based on user queries
- 💬 **Real-time chat** - Instant responses with typing indicators
- 📱 **Responsive UI** - Works perfectly on desktop and mobile
- 🔍 **Product search** - Helps users find specific products and services
- ⭐ **Vendor recommendations** - Shows vendor details, ratings, and contact info
- 🎨 **Modern design** - Clean, minimalist chat interface
- 📊 **Analytics** - Backend tracks all conversations for improvements

## How It Works

### Frontend Components
1. **ChatBot.jsx** - Main chat interface component
2. **useChatBot.js** - Custom hook for API integration
3. **UserDashboardOptimized.js** - Updated to include ChatBot

### Backend Integration
- **Endpoint**: `http://localhost:8080/api/chatbot`
- **Controller**: `ChatbotController.java`
- **Service**: `ChatbotService.java`
- **Models**: ChatBot message storage and vendor recommendations

### Key Features:

#### 1. Smart Conversation
- Understands product queries: "I need electronics"
- Service requests: "Who provides web development?"
- General help: "What can you help me with?"

#### 2. Vendor Recommendations
- Premium vendors get priority
- Performance-based ranking
- Detailed vendor profiles with contact information
- Product categories and expertise areas

#### 3. Session Management
- Maintains conversation context
- User identification for logged-in users
- Chat history preservation

#### 4. Error Handling
- Graceful fallbacks when backend is unavailable
- User-friendly error messages
- Retry mechanisms

## Usage

### For Users:
1. **Access**: Click the chat icon (💬) in the bottom-right corner
2. **Start chatting**: Type your questions about products or services
3. **Get recommendations**: View vendor suggestions with contact details
4. **Contact vendors**: Click on vendor cards for detailed information

### Example Queries:
- "I need industrial equipment"
- "Who sells office furniture?"
- "Find electronics vendors"
- "I'm looking for web development services"
- "Show me premium vendors"

### For Developers:

#### Environment Variables
```bash
# .env.development
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_ENV=development
REACT_APP_DEBUG=true
```

#### Backend Configuration
Make sure your Spring Boot application has:
- CORS configured for `http://localhost:3000`
- ChatBot endpoints active
- Database connections working

#### Testing the Integration:
1. Start your Spring Boot backend on port 8080
2. Start your React frontend on port 3000
3. Open the user dashboard
4. Click the chat icon and test the conversation

## API Endpoints

### ChatBot Endpoints:
- `POST /api/chatbot/chat` - Send message
- `POST /api/chatbot/start-session` - Initialize chat session
- `GET /api/chatbot/history/{sessionId}` - Get chat history
- `GET /api/chatbot/health` - Health check

### Request/Response Format:

#### Send Message Request:
```json
{
  "message": "I need electronics",
  "sessionId": "uuid-session-id",
  "userId": 123,
  "userIp": "192.168.1.1"
}
```

#### Response:
```json
{
  "response": "Here are the top recommended vendors...",
  "sessionId": "uuid-session-id",
  "hasRecommendations": true,
  "recommendations": [
    {
      "vendorId": 1,
      "vendorName": "TechCorp Solutions",
      "vendorType": "GOLD",
      "vendorEmail": "contact@techcorp.com",
      "vendorPhone": "+91-9876543210",
      "performanceScore": 4.8,
      "products": ["Laptops", "Mobile Phones"],
      "categories": ["Electronics"],
      "reason": "Premium GOLD vendor with 25 products"
    }
  ]
}
```

## Customization

### Styling:
- Colors, fonts, and spacing can be customized in `ChatBot.jsx`
- Uses Chakra UI theme system for consistency

### Backend Logic:
- Modify `ChatbotService.java` to change recommendation algorithms
- Update keyword matching in `generateResponse()` method
- Customize vendor ranking logic in `compareVendorsByPriority()`

### Frontend Behavior:
- Adjust chat window size and position
- Modify message formatting and display
- Add new chat features like file uploads or voice messages

## Troubleshooting

### Common Issues:

1. **Chat not working**: Check if backend is running on port 8080
2. **CORS errors**: Verify CORS configuration in Spring Boot
3. **No recommendations**: Ensure you have vendors and products in your database
4. **Session errors**: Check if session management is working correctly

### Debug Mode:
Set `REACT_APP_DEBUG=true` to see detailed console logs for API calls and responses.

## Security

- All messages are stored with user context for logged-in users
- IP addresses are tracked for analytics
- Session IDs are UUID-based for security
- Authorization headers are included for authenticated requests

## Future Enhancements

Potential improvements for the ChatBot:
- Voice message support
- File sharing capabilities
- Multilingual support
- Advanced NLP integration
- Push notifications for responses
- Mobile app integration
- Vendor direct messaging

---

The ChatBot is now fully integrated and ready to help users find the best vendors and products on your platform! 🚀
