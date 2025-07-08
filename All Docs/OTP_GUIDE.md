# 📧📱 OTP Guide - Indian Trade Mart

## 🔍 **Current Status: Development Mode**

**OTP email aur phone par nahi aa rahe** kyunki abhi **development mode** mein hai. Real email/SMS services configure nahi hain.

## 🧪 **Testing Ke Liye (Current Setup):**

### **Step 1: Backend Console Check Karo**
Jab aap registration/login karte hain, **backend terminal** mein OTP print hota hai:

```
============================================================
📧 EMAIL SENT TO: your-email@example.com
From: noreply@indiantradeMart.com
Subject: Indian Trade Mart - OTP Verification

Content:
Dear User,

Welcome to Indian Trade Mart!

Your One-Time Password (OTP) for verification is: 123456

🔑 OTP: 123456
============================================================

📱 SMS OTP to +919876543210: 123456
```

### **Step 2: Testing Process**
1. **Backend terminal** open rakho
2. **Frontend** mein registration form fill karo
3. **"Create Account & Send OTP"** click karo
4. **Backend console** mein scroll karo aur OTP find karo
5. **Frontend** mein woh OTP enter karo
6. **"Verify & Login"** click karo

## 📧 **Real Email Enable Karne Ke Liye:**

### **Option 1: Gmail SMTP**

#### **Step 1: Gmail App Password Create Karo**
1. Google Account Settings → Security
2. 2-Step Verification enable karo
3. App passwords generate karo
4. Password save karo

#### **Step 2: Backend Configuration**
`application.properties` mein yeh uncomment aur update karo:

```properties
# Email Configuration (Gmail SMTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-actual-email@gmail.com
spring.mail.password=your-gmail-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.protocols=TLSv1.2
```

#### **Step 3: EmailService Update Karo**
Real email sending ke liye Spring Mail dependency add karni hogi:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

### **Option 2: SendGrid (Recommended for Production)**

#### **Step 1: SendGrid Account**
1. SendGrid account banao
2. API key generate karo

#### **Step 2: Configuration**
```properties
# SendGrid Configuration
sendgrid.api.key=your-sendgrid-api-key
sendgrid.from.email=noreply@yourdomain.com
```

## 📱 **Real SMS Enable Karne Ke Liye:**

### **Option 1: Twilio (International)**

#### **Step 1: Twilio Account**
1. Twilio account banao
2. Phone number buy karo
3. API credentials lo

#### **Step 2: Configuration**
```properties
# Twilio Configuration
twilio.account.sid=your_account_sid
twilio.auth.token=your_auth_token
twilio.phone.number=+1234567890
```

### **Option 2: Indian SMS Providers**

#### **TextLocal (Indian Provider)**
```properties
# TextLocal Configuration
textlocal.api.key=your_textlocal_api_key
textlocal.sender.id=TXTLCL
```

#### **MSG91 (Indian Provider)**
```properties
# MSG91 Configuration
msg91.api.key=your_msg91_api_key
msg91.sender.id=your_sender_id
```

## 🚀 **Quick Real Email Setup (Gmail):**

### **Step 1: Gmail Setup**
1. Gmail account mein jao
2. Security settings → 2-Step Verification → App passwords
3. "Mail" select karo aur app password generate karo

### **Step 2: Backend Update**
`application.properties` mein:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=youremail@gmail.com
spring.mail.password=your-16-digit-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### **Step 3: EmailService Update**
```java
@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    public void sendOtp(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("Indian Trade Mart - OTP Verification");
        message.setText("Your OTP is: " + otp);
        
        mailSender.send(message);
    }
}
```

## 🧪 **Testing Current Setup:**

### **Terminal Commands:**
```bash
# Backend start karo
cd D:\itech-backend\itech-backend
.\mvnw.cmd spring-boot:run

# Frontend start karo (new terminal)
cd E:\IndianTradeMart-main
npm run itm
```

### **Test Flow:**
1. `http://localhost:3000/vendor-auth` par jao
2. Registration form fill karo
3. Backend terminal mein OTP dekho
4. Frontend mein OTP enter karo

## 🎯 **Current Working Status:**

### ✅ **Working (Development Mode):**
- ✅ Registration form
- ✅ OTP generation
- ✅ OTP verification
- ✅ JWT token storage
- ✅ Backend console mein OTP display

### 🔧 **Need Configuration (Production):**
- 📧 Real email sending
- 📱 Real SMS sending
- 🌐 Production deployment

## 💡 **Pro Tips:**

1. **Development mein**: Backend console se OTP lo
2. **Testing ke liye**: Browser dev tools mein network tab check karo
3. **Production ke liye**: Real email/SMS services configure karo
4. **Security**: Production mein strong OTP validation add karo

## 🐛 **Common Issues:**

### **Backend Console mein OTP nahi dikh raha:**
- Backend properly start hui hai check karo
- Registration request actual mein backend tak ja rahi hai check karo
- Browser dev tools mein network requests check karo

### **Frontend errors:**
- Browser console check karo
- Network tab mein API calls check karo
- CORS errors check karo

**Abhi ke liye backend console se OTP lo aur test karo! 🚀**
