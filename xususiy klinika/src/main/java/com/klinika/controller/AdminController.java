package com.klinika.controller;

import com.klinika.entity.User;
import com.klinika.service.UserService;
import com.klinika.service.BemorService;
import com.klinika.service.DoktorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    
    private final UserService userService;
    private final BemorService bemorService;
    private final DoktorService doktorService;
    
    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        long adminlarSoni = userService.countUsersByRole(User.Role.ADMIN);
        long doktorlarSoni = userService.countUsersByRole(User.Role.DOKTOR);
        long bemorlarSoni = userService.countUsersByRole(User.Role.BEMOR);
        long qabulxonaSoni = userService.countUsersByRole(User.Role.QABULXONA);
        
        model.addAttribute("adminlarSoni", adminlarSoni);
        model.addAttribute("doktorlarSoni", doktorlarSoni);
        model.addAttribute("bemorlarSoni", bemorlarSoni);
        model.addAttribute("qabulxonaSoni", qabulxonaSoni);
        model.addAttribute("jamiFoydalanuvchilar", adminlarSoni + doktorlarSoni + bemorlarSoni + qabulxonaSoni);
        
        return "admin/admin-dashboard";
    }
    
    @GetMapping("/users")
    public String usersPage(Model model) {
        List<User> allUsers = userService.getAllUsers();
        model.addAttribute("users", allUsers);
        return "admin/users";
    }
    
    @GetMapping("/users/new")
    public String newUserPage(Model model) {
        model.addAttribute("user", new User());
        return "admin/user-form";
    }
    
    @PostMapping("/users")
    public String createUser(@ModelAttribute User user,
                           RedirectAttributes redirectAttributes) {
        try {
            userService.createUser(user);
            redirectAttributes.addFlashAttribute("success", "Foydalanuvchi muvaffaqiyatli yaratildi!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Foydalanuvchi yaratishda xatolik: " + e.getMessage());
        }
        return "redirect:/admin/users";
    }
    
    @GetMapping("/users/{id}/edit")
    public String editUserPage(@PathVariable Long id, Model model) {
        User user = userService.getUserById(id)
            .orElseThrow(() -> new RuntimeException("Foydalanuvchi topilmadi: " + id));
        model.addAttribute("user", user);
        return "admin/user-form";
    }
    
    @PostMapping("/users/{id}")
    public String updateUser(@PathVariable Long id,
                           @ModelAttribute User user,
                           RedirectAttributes redirectAttributes) {
        try {
            userService.updateUser(id, user);
            redirectAttributes.addFlashAttribute("success", "Foydalanuvchi muvaffaqiyatli yangilandi!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Foydalanuvchi yangilashda xatolik: " + e.getMessage());
        }
        return "redirect:/admin/users";
    }
    
    @PostMapping("/users/{id}/toggle-status")
    public String toggleUserStatus(@PathVariable Long id,
                                 RedirectAttributes redirectAttributes) {
        try {
            userService.toggleUserStatus(id);
            redirectAttributes.addFlashAttribute("success", "Foydalanuvchi holati yangilandi!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Holat yangilashda xatolik: " + e.getMessage());
        }
        return "redirect:/admin/users";
    }
    
    @GetMapping("/doktorlar")
    public String doktorlarPage(Model model) {
        List<User> doktorlar = userService.getUsersByRole(User.Role.DOKTOR);
        model.addAttribute("doktorlar", doktorlar);
        return "admin/doktorlar";
    }
    
    @GetMapping("/bemorlar")
    public String bemorlarPage(Model model) {
        List<User> bemorlar = userService.getUsersByRole(User.Role.BEMOR);
        model.addAttribute("bemorlar", bemorlar);
        return "admin/bemorlar";
    }
    
    @GetMapping("/statistika")
    public String statistikaPage(Model model) {
        long jamiBemorlar = userService.countUsersByRole(User.Role.BEMOR);
        long jamiDoktorlar = userService.countUsersByRole(User.Role.DOKTOR);
        long faolDoktorlar = doktorService.getActiveDoktorlar().size();
        long qandliDiabet = bemorService.countQandliDiabetBemorlar();
        long yurakBulimi = bemorService.countYurakBulimiBemorlar();
        
        model.addAttribute("jamiBemorlar", jamiBemorlar);
        model.addAttribute("jamiDoktorlar", jamiDoktorlar);
        model.addAttribute("faolDoktorlar", faolDoktorlar);
        model.addAttribute("qandliDiabet", qandliDiabet);
        model.addAttribute("yurakBulimi", yurakBulimi);
        
        return "admin/statistika";
    }
    
    @GetMapping("/sozlamalar")
    public String sozlamalarPage() {
        return "admin/sozlamalar";
    }
}