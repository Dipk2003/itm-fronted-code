package com.indiantrademart.controller;

import com.indiantrademart.dto.JwtResponse;
import com.indiantrademart.dto.LoginRequest;
import com.indiantrademart.dto.MessageResponse;
import com.indiantrademart.dto.SignupRequest;
import com.indiantrademart.dto.VerifyOtpRequest;
import com.indiantrademart.entity.Role;
import com.indiantrademart.entity.User;
import com.indiantrademart.repository.UserRepository;
import com.indiantrademart.security.JwtUtils;
import com.indiantrademart.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Random;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Check if user exists by email or phone
            User user = userRepository.findByEmailOrPhone(loginRequest.getEmailOrPhone())
                    .orElse(null);

            if (user == null) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: User not found!"));
            }

            // If password is provided, do direct authentication
            if (loginRequest.getPassword() != null && !loginRequest.getPassword().isEmpty()) {
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(user.getEmail(), loginRequest.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwt = jwtUtils.generateTokenFromEmail(user.getEmail(), user.getId(), user.getRole().name());

                return ResponseEntity.ok(new JwtResponse(jwt, 
                                                        user.getId(),
                                                        user.getEmail(),
                                                        user.getFirstName(),
                                                        user.getLastName(),
                                                        user.getRole().name()));
            } else {
                // Generate and send OTP
                String otp = generateOTP();
                user.setOtpCode(otp);
                user.setOtpExpiresAt(LocalDateTime.now().plusMinutes(10)); // OTP expires in 10 minutes
                userRepository.save(user);

                // Send OTP via email (you can also implement SMS)
                try {
                    emailService.sendOtpEmail(user.getEmail(), otp, user.getFirstName());
                    return ResponseEntity.ok(new MessageResponse("OTP sent successfully to your email!"));
                } catch (Exception e) {
                    return ResponseEntity.badRequest()
                            .body(new MessageResponse("Error: Failed to send OTP. Please try again."));
                }
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid credentials!"));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest verifyRequest) {
        try {
            User user = userRepository.findByEmailOrPhone(verifyRequest.getEmailOrPhone())
                    .orElse(null);

            if (user == null) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: User not found!"));
            }

            // Check if OTP is valid and not expired
            if (user.getOtpCode() == null || 
                !user.getOtpCode().equals(verifyRequest.getOtp()) ||
                user.getOtpExpiresAt().isBefore(LocalDateTime.now())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Invalid or expired OTP!"));
            }

            // Clear OTP after successful verification
            user.setOtpCode(null);
            user.setOtpExpiresAt(null);
            user.setEmailVerified(true);
            userRepository.save(user);

            // Generate JWT token
            String jwt = jwtUtils.generateTokenFromEmail(user.getEmail(), user.getId(), user.getRole().name());

            return ResponseEntity.ok(new JwtResponse(jwt, 
                                                    user.getId(),
                                                    user.getEmail(),
                                                    user.getFirstName(),
                                                    user.getLastName(),
                                                    user.getRole().name()));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: OTP verification failed!"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        if (signUpRequest.getPhone() != null && userRepository.existsByPhone(signUpRequest.getPhone())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Phone number is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getFirstName(),
                           signUpRequest.getLastName(),
                           signUpRequest.getEmail(),
                           signUpRequest.getPhone(),
                           encoder.encode(signUpRequest.getPassword()));

        // Set role
        if (signUpRequest.getRole() != null) {
            try {
                Role role = Role.valueOf(signUpRequest.getRole().toUpperCase());
                user.setRole(role);
            } catch (IllegalArgumentException e) {
                user.setRole(Role.ROLE_USER);
            }
        } else {
            user.setRole(Role.ROLE_USER);
        }

        userRepository.save(user);

        // Send welcome email with OTP for verification
        String otp = generateOTP();
        user.setOtpCode(otp);
        user.setOtpExpiresAt(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        try {
            emailService.sendWelcomeEmail(user.getEmail(), otp, user.getFirstName());
        } catch (Exception e) {
            // Registration still successful even if email fails
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully! Please check your email for verification OTP."));
    }

    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // 6-digit OTP
        return String.valueOf(otp);
    }
}
