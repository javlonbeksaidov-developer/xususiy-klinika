package com.klinika.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "ism", nullable = false, length = 50)
    private String ism;
    
    @Column(name = "familiya", nullable = false, length = 50)
    private String familiya;
    
    @Column(name = "otasining_ismi", length = 50)
    private String otasiningIsmi;
    
    @Column(name = "telefon", unique = true, nullable = false, length = 20)
    private String telefon;
    
    @Column(name = "email", unique = true, length = 100)
    private String email;
    
    @Column(name = "parol", nullable = false, length = 255)
    private String parol;
    
    @Column(name = "role", nullable = false, length = 20)
    private String role; // ADMIN, DOKTOR, QABULXONA, BEMOR
    
    @Column(name = "jins", length = 10)
    private String jins; // ERKAK, AYOL
    
    @Column(name = "tugilgan_sana")
    private LocalDateTime tugilganSana;
    
    @Column(name = "manzil", length = 200)
    private String manzil;
    
    @Column(name = "pasport_seriya", length = 10)
    private String pasportSeriya;
    
    @Column(name = "pasport_raqam", length = 20)
    private String pasportRaqam;
    
    @Column(name = "faol", nullable = false)
    private Boolean faol = true;
    
    @Column(name = "rasm_url", length = 255)
    private String rasmUrl;
    
    @Column(name = "yaratilgan_vaqt", nullable = false)
    private LocalDateTime yaratilganVaqt = LocalDateTime.now();
    
    @Column(name = "yangilangan_vaqt")
    private LocalDateTime yangilanganVaqt;
    
    @PreUpdate
    protected void onUpdate() {
        this.yangilanganVaqt = LocalDateTime.now();
    }
    
    // Konstruktorlar
    public User(String ism, String familiya, String telefon, String parol, String role) {
        this.ism = ism;
        this.familiya = familiya;
        this.telefon = telefon;
        this.parol = parol;
        this.role = role;
        this.faol = true;
        this.yaratilganVaqt = LocalDateTime.now();
    }
    
    // To'liq ism olish uchun metod
    public String getToliqIsm() {
        if (otasiningIsmi != null && !otasiningIsmi.isEmpty()) {
            return ism + " " + familiya + " " + otasiningIsmi;
        }
        return ism + " " + familiya;
    }
    
    // Role lar uchun konstantalar
    public static class Role {
        public static final String ADMIN = "ADMIN";
        public static final String DOKTOR = "DOKTOR";
        public static final String QABULXONA = "QABULXONA";
        public static final String BEMOR = "BEMOR";
    }
    
    // Jins lar uchun konstantalar
    public static class Jins {
        public static final String ERKAK = "ERKAK";
        public static final String AYOL = "AYOL";
    }
}