package com.klinika.repository;

import com.klinika.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByTelefon(String telefon);
    
    Optional<User> findByEmail(String email);
    
    List<User> findByRole(String role);
    
    List<User> findByFaolTrue();
    
    List<User> findByFaolFalse();
    
    List<User> findByRoleAndFaolTrue(String role);
    
    boolean existsByTelefon(String telefon);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.ism LIKE %:query% OR u.familiya LIKE %:query% OR u.telefon LIKE %:query%")
    List<User> searchUsers(@Param("query") String query);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") String role);
    
    @Query("SELECT u FROM User u WHERE u.role = 'DOKTOR' AND u.faol = true ORDER BY u.ism, u.familiya")
    List<User> findAllActiveDoktorlar();
    
    @Query("SELECT u FROM User u WHERE u.role = 'BEMOR' AND u.faol = true ORDER BY u.yaratilganVaqt DESC")
    List<User> findAllActiveBemorlar();
}