package com.klinika.service;

import com.klinika.entity.User;
import com.klinika.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private User adminUser;
    private User doctorUser;
    private User patientUser;

    @BeforeEach
    void setUp() {
        // Test user setup
        testUser = new User();
        testUser.setId(1L);
        testUser.setIsm("Test");
        testUser.setFamiliya("User");
        testUser.setTelefon("+998901234567");
        testUser.setEmail("test@example.com");
        testUser.setParol("password123");
        testUser.setRole("BEMOR");
        testUser.setFaol(true);
        testUser.setYaratilganVaqt(LocalDateTime.now());

        // Admin user
        adminUser = new User();
        adminUser.setId(2L);
        adminUser.setIsm("Admin");
        adminUser.setFamiliya("User");
        adminUser.setTelefon("+998901234568");
        adminUser.setRole("ADMIN");
        adminUser.setFaol(true);

        // Doctor user
        doctorUser = new User();
        doctorUser.setId(3L);
        doctorUser.setIsm("Doctor");
        doctorUser.setFamiliya("User");
        doctorUser.setTelefon("+998901234569");
        doctorUser.setRole("DOKTOR");
        doctorUser.setFaol(true);

        // Patient user
        patientUser = new User();
        patientUser.setId(4L);
        patientUser.setIsm("Patient");
        patientUser.setFamiliya("User");
        patientUser.setTelefon("+998901234570");
        patientUser.setRole("BEMOR");
        patientUser.setFaol(true);
    }

    @Test
    void getAllUsers_ShouldReturnAllUsers() {
        // Arrange
        List<User> expectedUsers = Arrays.asList(testUser, adminUser, doctorUser, patientUser);
        when(userRepository.findAll()).thenReturn(expectedUsers);

        // Act
        List<User> actualUsers = userService.getAllUsers();

        // Assert
        assertNotNull(actualUsers);
        assertEquals(4, actualUsers.size());
        assertEquals(expectedUsers, actualUsers);
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getUserById_WhenUserExists_ShouldReturnUser() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        Optional<User> result = userService.getUserById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(testUser, result.get());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void getUserById_WhenUserNotExists_ShouldReturnEmpty() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Optional<User> result = userService.getUserById(999L);

        // Assert
        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findById(999L);
    }

    @Test
    void getUserByTelefon_WhenUserExists_ShouldReturnUser() {
        // Arrange
        when(userRepository.findByTelefon("+998901234567")).thenReturn(Optional.of(testUser));

        // Act
        Optional<User> result = userService.getUserByTelefon("+998901234567");

        // Assert
        assertTrue(result.isPresent());
        assertEquals(testUser, result.get());
        verify(userRepository, times(1)).findByTelefon("+998901234567");
    }

    @Test
    void createUser_ShouldEncodePasswordAndSaveUser() {
        // Arrange
        User newUser = new User();
        newUser.setIsm("New");
        newUser.setFamiliya("User");
        newUser.setTelefon("+998901234571");
        newUser.setParol("plainPassword");
        newUser.setRole("BEMOR");

        when(passwordEncoder.encode("plainPassword")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(5L);
            return user;
        });

        // Act
        User result = userService.createUser(newUser);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals("encodedPassword", result.getParol());
        assertTrue(result.getFaol());
        assertNotNull(result.getYaratilganVaqt());
        
        verify(passwordEncoder, times(1)).encode("plainPassword");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateUser_WhenUserExists_ShouldUpdateUserDetails() {
        // Arrange
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setIsm("Old");
        existingUser.setFamiliya("Name");
        existingUser.setTelefon("+998901234567");
        existingUser.setEmail("old@example.com");
        existingUser.setParol("oldEncodedPassword");
        existingUser.setRole("BEMOR");
        existingUser.setFaol(true);

        User updateData = new User();
        updateData.setIsm("Updated");
        updateData.setFamiliya("Name");
        updateData.setTelefon("+998901234572");
        updateData.setEmail("updated@example.com");
        updateData.setParol("newPassword");
        updateData.setJins("ERKAK");
        updateData.setManzil("Yangi manzil");

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        // Act
        User result = userService.updateUser(1L, updateData);

        // Assert
        assertNotNull(result);
        assertEquals("Updated", result.getIsm());
        assertEquals("Name", result.getFamiliya());
        assertEquals("+998901234572", result.getTelefon());
        assertEquals("updated@example.com", result.getEmail());
        assertEquals("ERKAK", result.getJins());
        assertEquals("Yangi manzil", result.getManzil());
        assertEquals("oldEncodedPassword", result.getParol()); // Password shouldn't change when not provided
        
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(existingUser);
    }

    @Test
    void updateUser_WhenUserExistsAndPasswordProvided_ShouldUpdatePassword() {
        // Arrange
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setParol("oldEncodedPassword");

        User updateData = new User();
        updateData.setParol("newPassword");

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.encode("newPassword")).thenReturn("newEncodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        // Act
        User result = userService.updateUser(1L, updateData);

        // Assert
        assertNotNull(result);
        assertEquals("newEncodedPassword", result.getParol());
        
        verify(passwordEncoder, times(1)).encode("newPassword");
        verify(userRepository, times(1)).save(existingUser);
    }

    @Test
    void updateUser_WhenUserNotExists_ShouldThrowException() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.updateUser(999L, testUser);
        });

        assertEquals("Foydalanuvchi topilmadi: 999", exception.getMessage());
        verify(userRepository, times(1)).findById(999L);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deleteUser_WhenUserExists_ShouldSetUserInactive() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        userService.deleteUser(1L);

        // Assert
        assertFalse(testUser.getFaol());
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void deleteUser_WhenUserNotExists_ShouldThrowException() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.deleteUser(999L);
        });

        assertEquals("Foydalanuvchi topilmadi: 999", exception.getMessage());
        verify(userRepository, times(1)).findById(999L);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getUsersByRole_ShouldReturnUsersWithSpecificRole() {
        // Arrange
        List<User> doctors = Arrays.asList(doctorUser);
        when(userRepository.findByRole("DOKTOR")).thenReturn(doctors);

        // Act
        List<User> result = userService.getUsersByRole("DOKTOR");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(doctorUser, result.get(0));
        verify(userRepository, times(1)).findByRole("DOKTOR");
    }

    @Test
    void searchUsers_ShouldReturnMatchingUsers() {
        // Arrange
        String query = "Test";
        List<User> expectedUsers = Arrays.asList(testUser);
        when(userRepository.searchUsers(query)).thenReturn(expectedUsers);

        // Act
        List<User> result = userService.searchUsers(query);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testUser, result.get(0));
        verify(userRepository, times(1)).searchUsers(query);
    }

    @Test
    void countUsersByRole_ShouldReturnCount() {
        // Arrange
        when(userRepository.countByRole("BEMOR")).thenReturn(2L);

        // Act
        long count = userService.countUsersByRole("BEMOR");

        // Assert
        assertEquals(2L, count);
        verify(userRepository, times(1)).countByRole("BEMOR");
    }

    @Test
    void telefonExists_WhenTelefonExists_ShouldReturnTrue() {
        // Arrange
        when(userRepository.existsByTelefon("+998901234567")).thenReturn(true);

        // Act
        boolean exists = userService.telefonExists("+998901234567");

        // Assert
        assertTrue(exists);
        verify(userRepository, times(1)).existsByTelefon("+998901234567");
    }

    @Test
    void telefonExists_WhenTelefonNotExists_ShouldReturnFalse() {
        // Arrange
        when(userRepository.existsByTelefon("+998901234599")).thenReturn(false);

        // Act
        boolean exists = userService.telefonExists("+998901234599");

        // Assert
        assertFalse(exists);
        verify(userRepository, times(1)).existsByTelefon("+998901234599");
    }

    @Test
    void emailExists_WhenEmailExists_ShouldReturnTrue() {
        // Arrange
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // Act
        boolean exists = userService.emailExists("test@example.com");

        // Assert
        assertTrue(exists);
        verify(userRepository, times(1)).existsByEmail("test@example.com");
    }

    @Test
    void getActiveDoktorlar_ShouldReturnActiveDoctors() {
        // Arrange
        List<User> activeDoctors = Arrays.asList(doctorUser);
        when(userRepository.findAllActiveDoktorlar()).thenReturn(activeDoctors);

        // Act
        List<User> result = userService.getActiveDoktorlar();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(doctorUser, result.get(0));
        verify(userRepository, times(1)).findAllActiveDoktorlar();
    }

    @Test
    void getActiveBemorlar_ShouldReturnActivePatients() {
        // Arrange
        List<User> activePatients = Arrays.asList(patientUser);
        when(userRepository.findAllActiveBemorlar()).thenReturn(activePatients);

        // Act
        List<User> result = userService.getActiveBemorlar();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(patientUser, result.get(0));
        verify(userRepository, times(1)).findAllActiveBemorlar();
    }

    @Test
    void toggleUserStatus_WhenUserActive_ShouldSetInactive() {
        // Arrange
        testUser.setFaol(true);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.toggleUserStatus(1L);

        // Assert
        assertNotNull(result);
        assertFalse(result.getFaol());
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void toggleUserStatus_WhenUserInactive_ShouldSetActive() {
        // Arrange
        testUser.setFaol(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.toggleUserStatus(1L);

        // Assert
        assertNotNull(result);
        assertTrue(result.getFaol());
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void toggleUserStatus_WhenUserNotExists_ShouldThrowException() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.toggleUserStatus(999L);
        });

        assertEquals("Foydalanuvchi topilmadi: 999", exception.getMessage());
        verify(userRepository, times(1)).findById(999L);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void createUser_WithNullPassword_ShouldHandleGracefully() {
        // Arrange
        User newUser = new User();
        newUser.setIsm("Test");
        newUser.setFamiliya("User");
        newUser.setTelefon("+998901234567");
        newUser.setParol(null);
        newUser.setRole("BEMOR");

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });

        // Act
        User result = userService.createUser(newUser);

        // Assert
        assertNotNull(result);
        assertNull(result.getParol()); // Password should remain null
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void getUserByTelefon_WithNonExistentTelefon_ShouldReturnEmpty() {
        // Arrange
        when(userRepository.findByTelefon("+998900000000")).thenReturn(Optional.empty());

        // Act
        Optional<User> result = userService.getUserByTelefon("+998900000000");

        // Assert
        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findByTelefon("+998900000000");
    }

    @Test
    void searchUsers_WithEmptyQuery_ShouldReturnAllUsers() {
        // Arrange
        List<User> allUsers = Arrays.asList(testUser, adminUser, doctorUser, patientUser);
        when(userRepository.searchUsers("")).thenReturn(allUsers);

        // Act
        List<User> result = userService.searchUsers("");

        // Assert
        assertNotNull(result);
        assertEquals(4, result.size());
        verify(userRepository, times(1)).searchUsers("");
    }

    @Test
    void createUser_ShouldSetDefaultValues() {
        // Arrange
        User newUser = new User();
        newUser.setIsm("New");
        newUser.setFamiliya("User");
        newUser.setTelefon("+998901234567");
        newUser.setParol("password");
        newUser.setRole("BEMOR");

        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });

        // Act
        User result = userService.createUser(newUser);

        // Assert
        assertNotNull(result);
        assertTrue(result.getFaol());
        assertNotNull(result.getYaratilganVaqt());
        assertNull(result.getYangilanganVaqt());
    }

    @Test
    void updateUser_WithNullUpdateData_ShouldHandleGracefully() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.updateUser(1L, new User());

        // Assert
        assertNotNull(result);
        // Original values should be preserved
        assertEquals("Test", result.getIsm());
        assertEquals("User", result.getFamiliya());
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(testUser);
    }
}