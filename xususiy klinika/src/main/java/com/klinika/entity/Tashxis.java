package com.klinika.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tashxislar")
@Data
public class Tashxis {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bemor_id", nullable = false)
    private Bemor bemor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doktor_id", nullable = false)
    private Doktor doktor;
    
    @Column(name = "shikoyatlar", columnDefinition = "TEXT")
    private String shikoyatlar;
    
    @Column(name = "tashxis_nomi", nullable = false, length = 200)
    private String tashxisNomi;
    
    @Column(name = "tashxis_tavsifi", columnDefinition = "TEXT")
    private String tashxisTavsifi;
    
    @Column(name = "davolash_rejasi", columnDefinition = "TEXT")
    private String davolashRejasi;
    
    @Column(name = "tavsiyalar", columnDefinition = "TEXT")
    private String tavsiyalar;
    
    @Column(name = "tashxis_sanasi", nullable = false)
    private LocalDateTime tashxisSanasi = LocalDateTime.now();
    
    @Column(name = "keyingi_kontrol_sanasi")
    private LocalDateTime keyingiKontrolSanasi;
    
    @Column(name = "holat", length = 20)
    private String holat = "FAOL"; // FAOL, YAKUNLANGAN, BEKOR_QILINGAN
    
    @OneToOne(mappedBy = "tashxis", cascade = CascadeType.ALL)
    private Retsept retsept;
    
    @PrePersist
    protected void onCreate() {
        if (tashxisSanasi == null) {
            tashxisSanasi = LocalDateTime.now();
        }
    }
    
    public static class Holat {
        public static final String FAOL = "FAOL";
        public static final String YAKUNLANGAN = "YAKUNLANGAN";
        public static final String BEKOR_QILINGAN = "BEKOR_QILINGAN";
    }
}