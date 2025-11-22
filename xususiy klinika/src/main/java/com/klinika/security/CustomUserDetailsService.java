package com.klinika.security;

import com.klinika.entity.User;
import com.klinika.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByTelefon(username)
            .orElseThrow(() -> new UsernameNotFoundException("Foydalanuvchi topilmadi: " + username));

        if (!user.getFaol()) {
            throw new UsernameNotFoundException("Foydalanuvchi faol emas: " + username);
        }

        return new CustomUserDetails(user);
    }

    public static class CustomUserDetails implements UserDetails {
        private final User user;

        public CustomUserDetails(User user) {
            this.user = user;
        }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
        }

        @Override
        public String getPassword() {
            return user.getParol();
        }

        @Override
        public String getUsername() {
            return user.getTelefon();
        }

        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        @Override
        public boolean isAccountNonLocked() {
            return user.getFaol();
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }

        @Override
        public boolean isEnabled() {
            return user.getFaol();
        }

        public User getUser() {
            return user;
        }

        public Long getId() {
            return user.getId();
        }

        public String getToliqIsm() {
            return user.getToliqIsm();
        }

        public String getRole() {
            return user.getRole();
        }
    }
}