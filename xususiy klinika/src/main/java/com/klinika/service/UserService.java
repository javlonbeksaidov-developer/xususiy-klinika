package com.klinika.service;

import com.klinika.entity.User;
import com.klinika.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByTelefon(String telefon) {
        return userRepository.findByTelefon(telefon);
    }
    
    public User createUser(User user) {
        user.setParol(passwordEncoder.encode(user.getParol()));
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, User userDetails) {
        return userRepository.findById(id)
            .map(existingUser -> {
                existingUser.setIsm(userDetails.getIsm());
                existingUser.setFamiliya(userDetails.getFamiliya());
                existingUser.setOtasiningIsmi(userDetails.getOtasiningIsmi());
                existingUser.setTelefon(userDetails.getTelefon());
                existingUser.setEmail(userDetails.getEmail());
                existingUser.setJins(userDetails.getJins());
                existingUser.setTugilganSana(userDetails.getTugilganSana());
                existingUser.setManzil(userDetails.getManzil());
                existingUser.setPasportSeriya(userDetails.getPasportSeriya());
                existingUser.setPasportRaqam(userDetails.getPasportRaqam());
                existingUser.setRasmUrl(userDetails.getRasmUrl());
                
                if (userDetails.getParol() != null && !userDetails.getParol().isEmpty()) {
                    existingUser.setParol(passwordEncoder.encode(userDetails.getParol()));
                }
                
                return userRepository.save(existingUser);
            })
            .orElseThrow(() -> new RuntimeException("Foydalanuvchi topilmadi: " + id));
    }
    
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Foydalanuvchi topilmadi: " + id));
        user.setFaol(false);
        userRepository.save(user);
    }
    
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }
    
    public List<User> searchUsers(String query) {
        return userRepository.searchUsers(query);
    }
    
    public long countUsersByRole(String role) {
        return userRepository.countByRole(role);
    }
    
    public boolean telefonExists(String telefon) {
        return userRepository.existsByTelefon(telefon);
    }
    
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public List<User> getActiveDoktorlar() {
        return userRepository.findAllActiveDoktorlar();
    }
    
    public List<User> getActiveBemorlar() {
        return userRepository.findAllActiveBemorlar();
    }
    
    public User toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Foydalanuvchi topilmadi: " + id));
        user.setFaol(!user.getFaol());
        return userRepository.save(user);
    }
}