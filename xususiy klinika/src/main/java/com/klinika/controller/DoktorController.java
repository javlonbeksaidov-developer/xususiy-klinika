package com.klinika.controller;

import com.klinika.entity.Doktor;
import com.klinika.entity.Tashxis;
import com.klinika.service.DoktorService;
import com.klinika.service.TashxisService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/doktor")
@RequiredArgsConstructor
public class DoktorController {
    
    private final DoktorService doktorService;
    private final TashxisService tashxisService;
    
    @GetMapping("/dashboard")
    public String dashboard(@RequestParam Long doktorId, Model model) {
        Doktor doktor = doktorService.getDoktorById(doktorId)
            .orElseThrow(() -> new RuntimeException("Doktor topilmadi: " + doktorId));
        
        long bugungiTashxislar = tashxisService.countBugungiTashxislar(doktorId);
        long jamiBemorlar = tashxisService.countBemorlarByDoktor(doktorId);
        
        model.addAttribute("doktor", doktor);
        model.addAttribute("bugungiTashxislar", bugungiTashxislar);
        model.addAttribute("jamiBemorlar", jamiBemorlar);
        
        return "doktor/doktor-dashboard";
    }
    
    @GetMapping("/bemorlarim")
    public String bemorlarim(@RequestParam Long doktorId, Model model) {
        List<Tashxis> bemorlar = tashxisService.getBemorlarByDoktor(doktorId);
        Doktor doktor = doktorService.getDoktorById(doktorId)
            .orElseThrow(() -> new RuntimeException("Doktor topilmadi: " + doktorId));
        
        model.addAttribute("bemorlar", bemorlar);
        model.addAttribute("doktor", doktor);
        
        return "doktor/bemorlarim";
    }
    
    @GetMapping("/tashxis")
    public String tashxisPage(@RequestParam Long doktorId, Model model) {
        Doktor doktor = doktorService.getDoktorById(doktorId)
            .orElseThrow(() -> new RuntimeException("Doktor topilmadi: " + doktorId));
        
        model.addAttribute("tashxis", new Tashxis());
        model.addAttribute("doktor", doktor);
        
        return "doktor/tashxis";
    }
    
    @PostMapping("/tashxis")
    public String createTashxis(@RequestParam Long doktorId,
                              @ModelAttribute Tashxis tashxis,
                              RedirectAttributes redirectAttributes) {
        try {
            Doktor doktor = doktorService.getDoktorById(doktorId)
                .orElseThrow(() -> new RuntimeException("Doktor topilmadi: " + doktorId));
            
            tashxis.setDoktor(doktor);
            tashxisService.createTashxis(tashxis);
            
            redirectAttributes.addFlashAttribute("success", "Tashxis muvaffaqiyatli qo'shildi!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Tashxis qo'shishda xatolik: " + e.getMessage());
        }
        return "redirect:/doktor/bemorlarim?doktorId=" + doktorId;
    }
    
    @GetMapping("/retsept")
    public String retseptPage(@RequestParam Long doktorId, Model model) {
        Doktor doktor = doktorService.getDoktorById(doktorId)
            .orElseThrow(() -> new RuntimeException("Doktor topilmadi: " + doktorId));
        
        model.addAttribute("doktor", doktor);
        return "doktor/retsept";
    }
    
    @GetMapping("/navbat")
    public String navbatPage(@RequestParam Long doktorId, Model model) {
        Doktor doktor = doktorService.getDoktorById(doktorId)
            .orElseThrow(() -> new RuntimeException("Doktor topilmadi: " + doktorId));
        
        model.addAttribute("doktor", doktor);
        return "doktor/navbat";
    }
    
    @GetMapping("/profil")
    public String profilPage(@RequestParam Long doktorId, Model model) {
        Doktor doktor = doktorService.getDoktorById(doktorId)
            .orElseThrow(() -> new RuntimeException("Doktor topilmadi: " + doktorId));
        
        model.addAttribute("doktor", doktor);
        return "doktor/profil";
    }
    
    @PostMapping("/profil")
    public String updateProfil(@RequestParam Long doktorId,
                             @ModelAttribute Doktor doktorDetails,
                             RedirectAttributes redirectAttributes) {
        try {
            doktorService.updateDoktor(doktorId, doktorDetails);
            redirectAttributes.addFlashAttribute("success", "Profil muvaffaqiyatli yangilandi!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Profil yangilashda xatolik: " + e.getMessage());
        }
        return "redirect:/doktor/profil?doktorId=" + doktorId;
    }
}