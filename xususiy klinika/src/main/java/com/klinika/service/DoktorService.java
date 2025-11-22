package com.klinika.service;

import com.klinika.entity.Doktor;
import com.klinika.repository.DoktorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DoktorService {
    
    private final DoktorRepository doktorRepository;
    
    public List<Doktor> getAllDoktorlar() {
        return doktorRepository.findAll();
    }
    
    public List<Doktor> getActiveDoktorlar() {
        return doktorRepository.findByFaolTrue();
    }
    
    public Optional<Doktor> getDoktorById(Long id) {
        return doktorRepository.findById(id);
    }
    
    public Optional<Doktor> getDoktorByTelefon(String telefon) {
        return doktorRepository.findByTelefon(telefon);
    }
    
    public Doktor createDoktor(Doktor doktor) {
        return doktorRepository.save(doktor);
    }
    
    public Doktor updateDoktor(Long id, Doktor doktorDetails) {
        return doktorRepository.findById(id)
            .map(existingDoktor -> {
                existingDoktor.setIsm(doktorDetails.getIsm());
                existingDoktor.setFamiliya(doktorDetails.getFamiliya());
                existingDoktor.setOtasiningIsmi(doktorDetails.getOtasiningIsmi());
                existingDoktor.setTelefon(doktorDetails.getTelefon());
                existingDoktor.setEmail(doktorDetails.getEmail());
                existingDoktor.setJins(doktorDetails.getJins());
                existingDoktor.setTugilganSana(doktorDetails.getTugilganSana());
                existingDoktor.setManzil(doktorDetails.getManzil());
                existingDoktor.setRasmUrl(doktorDetails.getRasmUrl());
                existingDoktor.setMutaxassislik(doktorDetails.getMutaxassislik());
                existingDoktor.setIshTajribasi(doktorDetails.getIshTajribasi());
                existingDoktor.setShifokorlikLicenziyasi(doktorDetails.getShifokorlikLicenziyasi());
                existingDoktor.setNarxPerKonsultatsiya(doktorDetails.getNarxPerKonsultatsiya());
                existingDoktor.setIshBoshlashVaqti(doktorDetails.getIshBoshlashVaqti());
                existingDoktor.setIshTugashVaqti(doktorDetails.getIshTugashVaqti());
                existingDoktor.setTanaffusBoshlanishi(doktorDetails.getTanaffusBoshlanishi());
                existingDoktor.setTanaffusTugashi(doktorDetails.getTanaffusTugashi());
                existingDoktor.setBirVaqtdaBemorlarSoni(doktorDetails.getBirVaqtdaBemorlarSoni());
                existingDoktor.setKonsultatsiyaVaqtiDaqiqada(doktorDetails.getKonsultatsiyaVaqtiDaqiqada());
                existingDoktor.setReyting(doktorDetails.getReyting());
                existingDoktor.setIzoh(doktorDetails.getIzoh());
                
                return doktorRepository.save(existingDoktor);
            })
            .orElseThrow(() -> new RuntimeException("Doktor topilmadi: " + id));
    }
    
    public void deleteDoktor(Long id) {
        Doktor doktor = doktorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Doktor topilmadi: " + id));
        doktor.setFaol(false);
        doktorRepository.save(doktor);
    }
    
    public List<Doktor> getDoktorlarByMutaxassislik(String mutaxassislik) {
        return doktorRepository.findByMutaxassislikAndFaolTrue(mutaxassislik);
    }
    
    public List<Doktor> searchDoktorlar(String query) {
        return doktorRepository.searchDoktorlar(query);
    }
    
    public List<Doktor> getTopReytingliDoktorlar() {
        return doktorRepository.findTop5ByReyting();
    }
    
    public List<Doktor> getDoktorlarByNarxOraligi(Double minNarx, Double maxNarx) {
        return doktorRepository.findByNarxBetween(minNarx, maxNarx);
    }
    
    public List<Doktor> getDoktorlarByMinReyting(Double minReyting) {
        return doktorRepository.findByReytingGreaterThanEqual(minReyting);
    }
    
    public Double getAverageReyting() {
        return doktorRepository.findAverageReyting();
    }
    
    public long countDoktorlarByTajriba(Integer minTajriba) {
        return doktorRepository.countByIshTajribasiGreaterThanEqual(minTajriba);
    }
    
    public Doktor updateDoktorReyting(Long id, Double yangiReyting) {
        Doktor doktor = doktorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Doktor topilmadi: " + id));
        doktor.setReyting(yangiReyting);
        return doktorRepository.save(doktor);
    }
    
    public Doktor toggleDoktorStatus(Long id) {
        Doktor doktor = doktorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Doktor topilmadi: " + id));
        doktor.setFaol(!doktor.getFaol());
        return doktorRepository.save(doktor);
    }
}