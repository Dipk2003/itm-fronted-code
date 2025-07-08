# Indian Trade Mart - Backend Documentation

## Overview
This is the Spring Boot backend for the Indian Trade Mart platform, a comprehensive B2B marketplace connecting users with vendors across various categories. The backend provides secure authentication, role-based access control, AI-powered chatbot integration, and comprehensive APIs for user, vendor, and admin management.

## 🚀 Features

### Core Features
- **Multi-Role Authentication System**: Support for Users, Vendors, and Admins with role-based access control
- **OTP-Based Authentication**: Secure login system with email/SMS OTP verification
- **AI ChatBot Integration**: Intelligent vendor recommendations based on user queries
- **Role-Based Dashboard Access**: Separate dashboards for different user types
- **Secure Password Management**: BCrypt password hashing and validation
- **JWT Token Authentication**: Stateless authentication with JWT tokens
- **Email Integration**: OTP delivery via email (Gmail SMTP supported)
- **Admin Access Control**: Special admin code verification system

### Authentication Features
- Password validation before OTP sending
- Enhanced error handling and validation
- Email-based OTP delivery (configurable for SMS)
- Role-specific login endpoints
- Admin code verification system
- JWT token-based session management

### AI ChatBot Features
- Natural language processing for user queries
- Category-based vendor recommendations
- Real-time chat interface
- Conversation history management
- Intelligent response generation

## 🛠️ Tech Stack

- **Framework**: Spring Boot 3.x
- **Database**: MySQL/H2 (configurable)
- **Authentication**: Spring Security with JWT
- **OTP Service**: JavaMailSender (Gmail SMTP)
- **AI Integration**: OpenAI API for chatbot responses
- **Build Tool**: Maven
- **Java Version**: 17+

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ (or H2 for development)
- Gmail account for SMTP (for OTP emails)
- OpenAI API key (for chatbot functionality)

## 🔧 Installation & Setup

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd IndianTradeMart-main/backend
```

### 2. Configure Database
Update `application.properties` with your database configuration:
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/indian_trade_mart
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

### 3. Configure Email (OTP Service)
```properties
# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### 4. Configure ChatBot (Optional)
```properties
# OpenAI Configuration
openai.api.key=your_openai_api_key
openai.api.url=https://api.openai.com/v1/chat/completions
```

### 5. Build and Run
```bash
# Clean and compile
mvn clean compile

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

## 🔐 Authentication System

### OTP-Based Authentication Flow
1. User enters email/phone and password
2. System validates credentials using BCrypt
3. If valid, OTP is sent via email/SMS
4. User enters OTP for verification
5. System generates JWT token upon successful OTP verification

### Role-Based Access Control
- **USER**: Access to user dashboard, product browsing, chatbot
- **VENDOR**: Access to vendor dashboard, product management, lead management
- **ADMIN**: Access to admin dashboard, user management, system configuration

### Admin Access Control
- Special admin code verification system
- Additional layer of security for admin accounts
- Configurable admin access codes

## 📚 API Endpoints

### Authentication Endpoints

#### User Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-otp
POST /api/auth/refresh-token
```

#### Vendor Authentication
```
POST /api/auth/vendor/register
POST /api/auth/vendor/login
POST /api/auth/vendor/verify-otp
```

#### Admin Authentication
```
POST /api/auth/admin/login
POST /api/auth/admin/verify-otp
POST /api/auth/admin/verify-admin-code
```

### User Management Endpoints
```
GET /api/users/profile
PUT /api/users/profile
GET /api/users/dashboard
DELETE /api/users/account
```

### Vendor Management Endpoints
```
GET /api/vendors/profile
PUT /api/vendors/profile
GET /api/vendors/dashboard
GET /api/vendors/products
POST /api/vendors/products
PUT /api/vendors/products/{id}
DELETE /api/vendors/products/{id}
GET /api/vendors/leads
PUT /api/vendors/leads/{id}/status
```

### Admin Management Endpoints
```
GET /api/admin/users
GET /api/admin/vendors
GET /api/admin/dashboard
PUT /api/admin/users/{id}/status
PUT /api/admin/vendors/{id}/status
GET /api/admin/analytics
```

### ChatBot Endpoints
```
POST /api/chatbot/message
GET /api/chatbot/history
DELETE /api/chatbot/history
GET /api/chatbot/recommendations
```

## 🤖 ChatBot Integration

### Features
- Natural language processing for user queries
- Category-based vendor recommendations
- Real-time response generation
- Conversation history management

### Usage
```javascript
// Send message to chatbot
POST /api/chatbot/message
{
  "message": "I need suppliers for electronic components",
  "category": "electronics"
}

// Response format
{
  "response": "I found several electronics suppliers for you...",
  "recommendations": [
    {
      "vendorId": "123",
      "name": "Tech Solutions Ltd",
      "category": "Electronics",
      "rating": 4.5
    }
  ]
}
```

## 🔒 Security Features

### Password Security
- BCrypt password hashing
- Password strength validation
- Secure password reset flow

### JWT Token Security
- Stateless authentication
- Token expiration management
- Refresh token mechanism

### OTP Security
- Time-limited OTP codes
- Maximum retry attempts
- Secure OTP generation

### Role-Based Security
- Method-level security annotations
- Role-specific endpoint access
- Admin privilege verification

## 🧪 Testing

### Authentication Testing
```bash
# Test user registration
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'

# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# Test OTP verification
curl -X POST http://localhost:8080/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

### ChatBot Testing
```bash
# Test chatbot message
curl -X POST http://localhost:8080/api/chatbot/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "I need textile suppliers"
  }'
```

## 🐛 Troubleshooting

### Common Issues

#### Authentication Issues
- **OTP not received**: Check email configuration and spam folder
- **Invalid credentials**: Verify user exists and password is correct
- **JWT token expired**: Use refresh token endpoint

#### Database Issues
- **Connection refused**: Check database server is running
- **Table not found**: Ensure `spring.jpa.hibernate.ddl-auto=update`
- **Data integrity errors**: Check foreign key constraints

#### Email Issues
- **OTP email not sending**: Verify Gmail SMTP configuration
- **Authentication failed**: Use App Password instead of regular password
- **Rate limiting**: Check email service limits

#### ChatBot Issues
- **No response**: Verify OpenAI API key is valid
- **Slow responses**: Check API rate limits
- **Invalid recommendations**: Verify vendor data exists

### Debug Mode
Enable debug logging in `application.properties`:
```properties
logging.level.com.indiantrademart=DEBUG
logging.level.org.springframework.security=DEBUG
```

## 🚦 Development vs Production

### Development Mode
- H2 in-memory database
- Console OTP output (for testing)
- Relaxed CORS policy
- Debug logging enabled

### Production Mode
- MySQL database
- Real email/SMS OTP delivery
- Strict CORS configuration
- Production logging levels

## 📈 Performance Optimization

### Database Optimization
- Connection pooling configured
- Query optimization with JPA
- Indexed fields for faster searches
- Lazy loading for related entities

### Caching
- JWT token caching
- User session caching
- Vendor recommendation caching

### Security Optimization
- Rate limiting on authentication endpoints
- Request size limits
- CORS configuration
- SQL injection prevention

## 🔮 Future Enhancements

### Planned Features
- **Multi-language Support**: Internationalization for global users
- **Advanced Analytics**: Business intelligence dashboard
- **Payment Integration**: Secure payment processing
- **File Upload**: Document and image management
- **Notification System**: Real-time notifications
- **API Rate Limiting**: Enhanced rate limiting
- **Audit Logging**: Comprehensive audit trails

### API Enhancements
- GraphQL support
- Webhook integration
- Batch processing APIs
- Export/Import functionality

### Security Enhancements
- Two-factor authentication
- OAuth2 integration
- Advanced threat detection
- Compliance reporting

## 📞 Support

For technical support or questions:
- Check the troubleshooting section above
- Review the API documentation
- Ensure all configuration is correct
- Check application logs for detailed error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This backend is designed to work with the React frontend. Ensure both are properly configured and running for full functionality.
