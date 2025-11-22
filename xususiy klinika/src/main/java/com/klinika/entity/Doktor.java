package com.klinika.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "doktorlar")
@Data
@EqualsAndHashCode(callSuper = true)
public class Doktor extends User {
    
    @Column(name = "mutaxassislik", nullable = false, length = 100)
    private String mutaxassislik;
    
    @Column(name = "ish_tajribasi")
    private Integer ishTajribasi;
    
    @Column(name = "shifokorlik_licenziyasi", length = 50)
    private String shifokorlikLicenziyasi;
    
    @Column(name = "narx_per_konsultatsiya")
    private Double narxPerKonsultatsiya;
    
    @Column(name = "ish_boshlash_vaqti", length = 5)
    private String ishBoshlashVaqti;
    
    @Column(name = "ish_tugash_vaqti", length = 5)
    private String ishTugashVaqti;
    
    @Column(name = "tanaffus_boshlanishi", length = 5)
    private String tanaffusBoshlanishi;
    
    @Column(name = "tanaffus_tugashi", length = 5)
    private String tanaffusTugashi;
    
    @Column(name = "bir_vaqtda_bemorlar_soni")
    private Integer birVaqtdaBemorlarSoni = 1;
    
    @Column(name = "konsultatsiya_vaqti_daqiqada")
    private Integer konsultatsiyaVaqtiDaqiqada = 30;
    
    @Column(name = "reyting")
    private Double reyting = 5.0;
    
    @Column(name = "izoh", columnDefinition = "TEXT")
    private String izoh;
    
    @OneToMany(mappedBy = "doktor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Tashxis> tashxislar = new ArrayList<>();
    
    @OneToMany(mappedBy = "doktor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Navbat> navbatlar = new ArrayList<>();
    
    public boolean isIshVaqtida() {
        // Ish vaqtini tekshirish logikasi
        return true;
    }
    
    public String getMutaxassislikVaTajriba() {
        return mutaxassislik + " (" + ishTajribasi + " yil tajriba)";
    }
    
    public static class Mutaxassislik {
        public static final String TERAPEVT = "Terapevt";
        public static final String KARDIOLOG = "Kardiolog";
        public static final String NEUROLOG = "Nevrolog";
        public static final String PEDIATR = "Pediatr";
        public static final String STOMATOLOG = "Stomatolog";
        public static final String ORTOPED = "Ortoped";
        public static final String GINEKOLOG = "Ginekolog";
        public static final String UROLOG = "Urolog";
        public static final String DERMATOLOG = "Dermatolog";
        public static final String OKULIST = "Okulist";
    }
}