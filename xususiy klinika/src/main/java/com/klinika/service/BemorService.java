package com.klinika.service;

import com.klinika.entity.Bemor;
import com.klinika.repository.BemorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BemorService {
    
    private final BemorRepository bemorRepository;
    
    public List<Bemor> getAllBemorlar() {
        return bemorRepository.findAll();
    }
    
    public Optional<Bemor> getBemorById(Long id) {
        return bemorRepository.findById(id);
    }
    
    public Optional<Bemor> getBemorByTelefon(String telefon) {
        return bemorRepository.findByTelefon(telefon);
    }
    
    public Optional<Bemor> getBemorByQaydRaqami(String qaydRaqami) {
        return bemorRepository.findByQaydRaqami(qaydRaqami);
    }
    
    public Bemor createBemor(Bemor bemor) {
        return bemorRepository.save(bemor);
    }
    
    public Bemor updateBemor(Long id, Bemor bemorDetails) {
        return bemorRepository.findById(id)
            .map(existingBemor -> {
                existingBemor.setIsm(bemorDetails.getIsm());
                existingBemor.setFamiliya(bemorDetails.getFamiliya());
                existingBemor.setOtasiningIsmi(bemorDetails.getOtasiningIsmi());
                existingBemor.setTelefon(bemorDetails.getTelefon());
                existingBemor.setEmail(bemorDetails.getEmail());
                existingBemor.setJins(bemorDetails.getJins());
                existingBemor.setTugilganSana(bemorDetails.getTugilganSana());
                existingBemor.setManzil(bemorDetails.getManzil());
                existingBemor.setPasportSeriya(bemorDetails.getPasportSeriya());
                existingBemor.setPasportRaqam(bemorDetails.getPasportRaqam());
                existingBemor.setRasmUrl(bemorDetails.getRasmUrl());
                existingBemor.setQonGuruhi(bemorDetails.getQonGuruhi());
                existingBemor.setOgirlik(bemorDetails.getOgirlik());
                existingBemor.setBoy(bemorDetails.getBoy());
                existingBemor.setQandliDiabet(bemorDetails.getQandliDiabet());
                existingBemor.setYurakBulimi(bemorDetails.getYurakBulimi());
                existingBemor.setAllergiya(bemorDetails.getAllergiya());
                existingBemor.setBoshqaKasalliklar(bemorDetails.getBoshqaKasalliklar());
                existingBemor.setShoshilinchAloqaIsmi(bemorDetails.getShoshilinchAloqaIsmi());
                existingBemor.setShoshilinchAloqaTelefon(bemorDetails.getShoshilinchAloqaTelefon());
                existingBemor.setSugurtaPolisi(bemorDetails.getSugurtaPolisi());
                existingBemor.setSugurtaKompaniyasi(bemorDetails.getSugurtaKompaniyasi());
                
                return bemorRepository.save(existingBemor);
            })
            .orElseThrow(() -> new RuntimeException("Bemor topilmadi: " + id));
    }
    
    public void deleteBemor(Long id) {
        Bemor bemor = bemorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bemor topilmadi: " + id));
        bemor.setFaol(false);
        bemorRepository.save(bemor);
    }
    
    public List<Bemor> searchBemorlar(String query) {
        return bemorRepository.searchBemorlar(query);
    }
    
    public List<Bemor> getBemorlarByQonGuruhi(String qonGuruhi) {
        return bemorRepository.findByQonGuruhi(qonGuruhi);
    }
    
    public List<Bemor> getQandliDiabetBemorlar() {
        return bemorRepository.findByQandliDiabetTrue();
    }
    
    public List<Bemor> getYurakBuliBemorlar() {
        return bemorRepository.findByYurakBulimiTrue();
    }
    
    public long countYangiBemorlar(LocalDate boshlanishSanasi, LocalDate tugashSanasi) {
        return bemorRepository.countByQabulQilinganSanaBetween(boshlanishSanasi, tugashSanasi);
    }
    
    public long countQandliDiabetBemorlar() {
        return bemorRepository.countQandliDiabetBemorlar();
    }
    
    public long countYurakBulimiBemorlar() {
        return bemorRepository.countYurakBulimiBemorlar();
    }
    
    public List<Bemor> getBugunQabulQilinganBemorlar() {
        return bemorRepository.findByQabulQilinganSana(LocalDate.now());
    }
    
    public Bemor toggleBemorStatus(Long id) {
        Bemor bemor = bemorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bemor topilmadi: " + id));
        bemor.setFaol(!bemor.getFaol());
        return bemorRepository.save(bemor);
    }
}