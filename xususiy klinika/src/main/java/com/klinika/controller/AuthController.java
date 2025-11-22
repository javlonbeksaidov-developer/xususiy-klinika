package com.klinika.controller;

import com.klinika.entity.User;
import com.klinika.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Optional;

@Controller
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    
    @GetMapping("/login")
    public String loginPage(@RequestParam(value = "error", required = false) String error,
                           @RequestParam(value = "logout", required = false) String logout,
                           Model model) {
        if (error != null) {
            model.addAttribute("error", "Telefon yoki parol noto'g'ri!");
        }
        if (logout != null) {
            model.addAttribute("message", "Siz tizimdan muvaffaqiyatli chiqdingiz!");
        }
        return "login";
    }
    
    @PostMapping("/login")
    public String login(@RequestParam String telefon, 
                       @RequestParam String parol,
                       RedirectAttributes redirectAttributes) {
        try {
            Optional<User> user = userService.getUserByTelefon(telefon);
            if (user.isPresent() && user.get().getFaol()) {
                // Parol tekshirish (keyin security bilan almashtiriladi)
                if (user.get().getParol().equals(parol)) {
                    return redirectToDashboard(user.get().getRole());
                }
            }
            redirectAttributes.addAttribute("error", true);
            return "redirect:/auth/login";
        } catch (Exception e) {
            redirectAttributes.addAttribute("error", true);
            return "redirect:/auth/login";
        }
    }
    
    @GetMapping("/register")
    public String registerPage(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }
    
    @PostMapping("/register")
    public String register(@ModelAttribute User user,
                          @RequestParam String parolTasdiq,
                          RedirectAttributes redirectAttributes) {
        try {
            if (!user.getParol().equals(parolTasdiq)) {
                redirectAttributes.addFlashAttribute("error", "Parollar mos kelmadi!");
                return "redirect:/auth/register";
            }
            
            if (userService.telefonExists(user.getTelefon())) {
                redirectAttributes.addFlashAttribute("error", "Bu telefon raqam allaqachon ro'yxatdan o'tgan!");
                return "redirect:/auth/register";
            }
            
            user.setRole(User.Role.BEMOR);
            userService.createUser(user);
            
            redirectAttributes.addFlashAttribute("success", "Ro'yxatdan muvaffaqiyatli o'tdingiz! Iltimos, tizimga kiring.");
            return "redirect:/auth/login";
            
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Ro'yxatdan o'tishda xatolik: " + e.getMessage());
            return "redirect:/auth/register";
        }
    }
    
    @GetMapping("/logout")
    public String logout(RedirectAttributes redirectAttributes) {
        redirectAttributes.addFlashAttribute("message", "Siz tizimdan chiqdingiz!");
        return "redirect:/auth/login";
    }
    
    @GetMapping("/forgot-password")
    public String forgotPasswordPage() {
        return "forgot-password";
    }
    
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String telefon,
                                RedirectAttributes redirectAttributes) {
        try {
            Optional<User> user = userService.getUserByTelefon(telefon);
            if (user.isPresent()) {
                // SMS orqali parol tiklash logikasi
                redirectAttributes.addFlashAttribute("message", "Parol tiklash ko'rsatmasi telefon raqamingizga yuborildi!");
            } else {
                redirectAttributes.addFlashAttribute("error", "Bu telefon raqam bilan foydalanuvchi topilmadi!");
            }
            return "redirect:/auth/forgot-password";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Xatolik yuz berdi: " + e.getMessage());
            return "redirect:/auth/forgot-password";
        }
    }
    
    private String redirectToDashboard(String role) {
        switch (role) {
            case User.Role.ADMIN:
                return "redirect:/admin/dashboard";
            case User.Role.DOKTOR:
                return "redirect:/doktor/dashboard";
            case User.Role.QABULXONA:
                return "redirect:/qabulxona/dashboard";
            case User.Role.BEMOR:
                return "redirect:/bemor/dashboard";
            default:
                return "redirect:/auth/login";
        }
    }
}