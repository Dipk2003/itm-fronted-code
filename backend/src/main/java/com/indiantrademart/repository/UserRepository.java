package com.indiantrademart.repository;

import com.indiantrademart.entity.User;
import com.indiantrademart.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByPhone(String phone);
    
    @Query("SELECT u FROM User u WHERE u.email = :emailOrPhone OR u.phone = :emailOrPhone")
    Optional<User> findByEmailOrPhone(@Param("emailOrPhone") String emailOrPhone);
    
    Boolean existsByEmail(String email);
    
    Boolean existsByPhone(String phone);
    
    List<User> findByRole(Role role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    Long countByRole(@Param("role") Role role);
    
    @Query("SELECT u FROM User u WHERE u.emailVerified = false OR u.phoneVerified = false")
    List<User> findUnverifiedUsers();
    
    @Query("SELECT u FROM User u WHERE u.otpCode = :otpCode AND u.otpExpiresAt > CURRENT_TIMESTAMP")
    Optional<User> findByValidOtpCode(@Param("otpCode") String otpCode);
}
