package com.klinika.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bemorlar")
@Data
@EqualsAndHashCode(callSuper = true)
public class Bemor extends User {
    
    @Column(name = "qon_guruhi", length = 5)
    private String qonGuruhi; // A+, O-, B+ va h.k.
    
    @Column(name = "ogirlik")
    private Double ogirlik; // kg
    
    @Column(name = "boy")
    private Double boy; // sm
    
    @Column(name = "qandli_diabet")
    private Boolean qandliDiabet = false;
    
    @Column(name = "yurak_bulimi")
    private Boolean yurakBulimi = false;
    
    @Column(name = "allergiya", length = 200)
    private String allergiya;
    
    @Column(name = "boshqa_kasalliklar", columnDefinition = "TEXT")
    private String boshqaKasalliklar;
    
    @Column(name = "qabul_qilingan_sana")
    private LocalDate qabulQilinganSana;
    
    @Column(name = "qayd_raqami", unique = true)
    private String qaydRaqami;
    
    @Column(name = "shoshilinch_aloqa_ismi", length = 100)
    private String shoshilinchAloqaIsmi;
    
    @Column(name = "shoshilinch_aloqa_telefon", length = 20)
    private String shoshilinchAloqaTelefon;
    
    @Column(name = "sugurta_polisi", length = 50)
    private String sugurtaPolisi;
    
    @Column(name = "sugurta_kompaniyasi", length = 100)
    private String sugurtaKompaniyasi;
    
    @PrePersist
    protected void onCreate() {
        if (this.qaydRaqami == null) {
            this.qaydRaqami = "BMR" + System.currentTimeMillis();
        }
        if (this.qabulQilinganSana == null) {
            this.qabulQilinganSana = LocalDate.now();
        }
    }
    
    public String getBMIsi() {
        if (boy == null || ogirlik == null || boy == 0) {
            return "Noma'lum";
        }
        double bmi = ogirlik / ((boy / 100) * (boy / 100));
        return String.format("%.1f", bmi);
    }
    
    public static class QonGuruhi {
        public static final String A_POZITIV = "A+";
        public static final String A_NEGATIV = "A-";
        public static final String B_POZITIV = "B+";
        public static final String B_NEGATIV = "B-";
        public static final String AB_POZITIV = "AB+";
        public static final String AB_NEGATIV = "AB-";
        public static final String O_POZITIV = "O+";
        public static final String O_NEGATIV = "O-";
    }
}