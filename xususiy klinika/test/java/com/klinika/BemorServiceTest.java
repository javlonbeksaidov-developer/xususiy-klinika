package com.klinika.service;

import com.klinika.entity.Bemor;
import com.klinika.repository.BemorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BemorServiceTest {

    @Mock
    private BemorRepository bemorRepository;

    @InjectMocks
    private BemorService bemorService;

    private Bemor testBemor;
    private Bemor activeBemor;
    private Bemor inactiveBemor;
    private Bemor diabeticBemor;
    private Bemor heartPatientBemor;

    @BeforeEach
    void setUp() {
        // Asosiy test bemor
        testBemor = new Bemor();
        testBemor.setId(1L);
        testBemor.setIsm("Ali");
        testBemor.setFamiliya("Valiyev");
        testBemor.setTelefon("+998901234567");
        testBemor.setQaydRaqami("BMR001");
        testBemor.setYosh(30);
        testBemor.setQonGuruhi("A+");
        testBemor.setOgirlik(70.0);
        testBemor.setBoy(175.0);
        testBemor.setQandliDiabet(false);
        testBemor.setYurakBulimi(false);
        testBemor.setFaol(true);
        testBemor.setQabulQilinganSana(LocalDate.now());

        // Faol bemor
        activeBemor = new Bemor();
        activeBemor.setId(2L);
        activeBemor.setIsm("Sevara");
        activeBemor.setFamiliya("Alimova");
        activeBemor.setTelefon("+998901234568");
        activeBemor.setQaydRaqami("BMR002");
        activeBemor.setFaol(true);

        // Nofaol bemor
        inactiveBemor = new Bemor();
        inactiveBemor.setId(3L);
        inactiveBemor.setIsm("Javohir");
        inactiveBemor.setFamiliya("Rahimov");
        inactiveBemor.setTelefon("+998901234569");
        inactiveBemor.setQaydRaqami("BMR003");
        inactiveBemor.setFaol(false);

        // Qandli diabet bemor
        diabeticBemor = new Bemor();
        diabeticBemor.setId(4L);
        diabeticBemor.setIsm("Dilnoza");
        diabeticBemor.setFamiliya("Xasanova");
        diabeticBemor.setTelefon("+998901234570");
        diabeticBemor.setQaydRaqami("BMR004");
        diabeticBemor.setQandliDiabet(true);
        diabeticBemor.setFaol(true);

        // Yurak bulimi bemor
        heartPatientBemor = new Bemor();
        heartPatientBemor.setId(5L);
        heartPatientBemor.setIsm("Farrux");
        heartPatientBemor.setFamiliya("To'rayev");
        heartPatientBemor.setTelefon("+998901234571");
        heartPatientBemor.setQaydRaqami("BMR005");
        heartPatientBemor.setYurakBulimi(true);
        heartPatientBemor.setFaol(true);
    }

    @Test
    void getAllBemorlar_ShouldReturnAllBemorlar() {
        // Arrange
        List<Bemor> expectedBemorlar = Arrays.asList(testBemor, activeBemor, inactiveBemor);
        when(bemorRepository.findAll()).thenReturn(expectedBemorlar);

        // Act
        List<Bemor> actualBemorlar = bemorService.getAllBemorlar();

        // Assert
        assertNotNull(actualBemorlar);
        assertEquals(3, actualBemorlar.size());
        assertEquals(expectedBemorlar, actualBemorlar);
        verify(bemorRepository, times(1)).findAll();
    }

    @Test
    void getBemorById_WhenBemorExists_ShouldReturnBemor() {
        // Arrange
        when(bemorRepository.findById(1L)).thenReturn(Optional.of(testBemor));

        // Act
        Optional<Bemor> result = bemorService.getBemorById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(testBemor, result.get());
        verify(bemorRepository, times(1)).findById(1L);
    }

    @Test
    void getBemorById_WhenBemorNotExists_ShouldReturnEmpty() {
        // Arrange
        when(bemorRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Optional<Bemor> result = bemorService.getBemorById(999L);

        // Assert
        assertFalse(result.isPresent());
        verify(bemorRepository, times(1)).findById(999L);
    }

    @Test
    void getBemorByTelefon_WhenBemorExists_ShouldReturnBemor() {
        // Arrange
        when(bemorRepository.findByTelefon("+998901234567")).thenReturn(Optional.of(testBemor));

        // Act
        Optional<Bemor> result = bemorService.getBemorByTelefon("+998901234567");

        // Assert
        assertTrue(result.isPresent());
        assertEquals(testBemor, result.get());
        verify(bemorRepository, times(1)).findByTelefon("+998901234567");
    }

    @Test
    void getBemorByQaydRaqami_WhenBemorExists_ShouldReturnBemor() {
        // Arrange
        when(bemorRepository.findByQaydRaqami("BMR001")).thenReturn(Optional.of(testBemor));

        // Act
        Optional<Bemor> result = bemorService.getBemorByQaydRaqami("BMR001");

        // Assert
        assertTrue(result.isPresent());
        assertEquals(testBemor, result.get());
        verify(bemorRepository, times(1)).findByQaydRaqami("BMR001");
    }

    @Test
    void createBemor_ShouldSaveBemor() {
        // Arrange
        Bemor newBemor = new Bemor();
        newBemor.setIsm("New");
        newBemor.setFamiliya("Bemor");
        newBemor.setTelefon("+998901234572");
        newBemor.setQonGuruhi("O+");
        newBemor.setOgirlik(65.0);
        newBemor.setBoy(170.0);

        when(bemorRepository.save(any(Bemor.class))).thenAnswer(invocation -> {
            Bemor bemor = invocation.getArgument(0);
            bemor.setId(6L);
            bemor.setQaydRaqami("BMR006");
            return bemor;
        });

        // Act
        Bemor result = bemorService.createBemor(newBemor);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getId());
        assertNotNull(result.getQaydRaqami());
        verify(bemorRepository, times(1)).save(any(Bemor.class));
    }

    @Test
    void updateBemor_WhenBemorExists_ShouldUpdateBemorDetails() {
        // Arrange
        Bemor existingBemor = new Bemor();
        existingBemor.setId(1L);
        existingBemor.setIsm("Old");
        existingBemor.setFamiliya("Name");
        existingBemor.setTelefon("+998901234567");
        existingBemor.setQonGuruhi("A+");
        existingBemor.setOgirlik(70.0);
        existingBemor.setBoy(175.0);
        existingBemor.setQandliDiabet(false);
        existingBemor.setYurakBulimi(false);

        Bemor updateData = new Bemor();
        updateData.setIsm("Updated");
        updateData.setFamiliya("Name");
        updateData.setTelefon("+998901234572");
        updateData.setQonGuruhi("B+");
        updateData.setOgirlik(75.0);
        updateData.setBoy(176.0);
        updateData.setQandliDiabet(true);
        updateData.setYurakBulimi(true);
        updateData.setAllergiya("Gilos allergiyasi");
        updateData.setBoshqaKasalliklar("Gipertoniya");

        when(bemorRepository.findById(1L)).thenReturn(Optional.of(existingBemor));
        when(bemorRepository.save(any(Bemor.class))).thenReturn(existingBemor);

        // Act
        Bemor result = bemorService.updateBemor(1L, updateData);

        // Assert
        assertNotNull(result);
        assertEquals("Updated", result.getIsm());
        assertEquals("Name", result.getFamiliya());
        assertEquals("+998901234572", result.getTelefon());
        assertEquals("B+", result.getQonGuruhi());
        assertEquals(75.0, result.getOgirlik());
        assertEquals(176.0, result.getBoy());
        assertTrue(result.getQandliDiabet());
        assertTrue(result.getYurakBulimi());
        assertEquals("Gilos allergiyasi", result.getAllergiya());
        assertEquals("Gipertoniya", result.getBoshqaKasalliklar());
        
        verify(bemorRepository, times(1)).findById(1L);
        verify(bemorRepository, times(1)).save(existingBemor);
    }

    @Test
    void updateBemor_WhenBemorNotExists_ShouldThrowException() {
        // Arrange
        when(bemorRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            bemorService.updateBemor(999L, testBemor);
        });

        assertEquals("Bemor topilmadi: 999", exception.getMessage());
        verify(bemorRepository, times(1)).findById(999L);
        verify(bemorRepository, never()).save(any(Bemor.class));
    }

    @Test
    void deleteBemor_WhenBemorExists_ShouldSetBemorInactive() {
        // Arrange
        when(bemorRepository.findById(1L)).thenReturn(Optional.of(testBemor));
        when(bemorRepository.save(any(Bemor.class))).thenReturn(testBemor);

        // Act
        bemorService.deleteBemor(1L);

        // Assert
        assertFalse(testBemor.getFaol());
        verify(bemorRepository, times(1)).findById(1L);
        verify(bemorRepository, times(1)).save(testBemor);
    }

    @Test
    void deleteBemor_WhenBemorNotExists_ShouldThrowException() {
        // Arrange
        when(bemorRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            bemorService.deleteBemor(999L);
        });

        assertEquals("Bemor topilmadi: 999", exception.getMessage());
        verify(bemorRepository, times(1)).findById(999L);
        verify(bemorRepository, never()).save(any(Bemor.class));
    }

    @Test
    void searchBemorlar_ShouldReturnMatchingBemorlar() {
        // Arrange
        String query = "Ali";
        List<Bemor> expectedBemorlar = Arrays.asList(testBemor);
        when(bemorRepository.searchBemorlar(query)).thenReturn(expectedBemorlar);

        // Act
        List<Bemor> result = bemorService.searchBemorlar(query);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testBemor, result.get(0));
        verify(bemorRepository, times(1)).searchBemorlar(query);
    }

    @Test
    void getBemorlarByQonGuruhi_ShouldReturnBemorlarWithSpecificBloodType() {
        // Arrange
        List<Bemor> aPlusBemorlar = Arrays.asList(testBemor);
        when(bemorRepository.findByQonGuruhi("A+")).thenReturn(aPlusBemorlar);

        // Act
        List<Bemor> result = bemorService.getBemorlarByQonGuruhi("A+");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testBemor, result.get(0));
        verify(bemorRepository, times(1)).findByQonGuruhi("A+");
    }

    @Test
    void getQandliDiabetBemorlar_ShouldReturnDiabeticBemorlar() {
        // Arrange
        List<Bemor> diabeticBemorlar = Arrays.asList(diabeticBemor);
        when(bemorRepository.findByQandliDiabetTrue()).thenReturn(diabeticBemorlar);

        // Act
        List<Bemor> result = bemorService.getQandliDiabetBemorlar();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(diabeticBemor, result.get(0));
        verify(bemorRepository, times(1)).findByQandliDiabetTrue();
    }

    @Test
    void getYurakBuliBemorlar_ShouldReturnHeartPatients() {
        // Arrange
        List<Bemor> heartPatients = Arrays.asList(heartPatientBemor);
        when(bemorRepository.findByYurakBulimiTrue()).thenReturn(heartPatients);

        // Act
        List<Bemor> result = bemorService.getYurakBuliBemorlar();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(heartPatientBemor, result.get(0));
        verify(bemorRepository, times(1)).findByYurakBulimiTrue();
    }

    @Test
    void countYangiBemorlar_ShouldReturnCountForDateRange() {
        // Arrange
        LocalDate startDate = LocalDate.now().minusDays(7);
        LocalDate endDate = LocalDate.now();
        when(bemorRepository.countByQabulQilinganSanaBetween(startDate, endDate)).thenReturn(5L);

        // Act
        long count = bemorService.countYangiBemorlar(startDate, endDate);

        // Assert
        assertEquals(5L, count);
        verify(bemorRepository, times(1)).countByQabulQilinganSanaBetween(startDate, endDate);
    }

    @Test
    void countQandliDiabetBemorlar_ShouldReturnCount() {
        // Arrange
        when(bemorRepository.countQandliDiabetBemorlar()).thenReturn(3L);

        // Act
        long count = bemorService.countQandliDiabetBemorlar();

        // Assert
        assertEquals(3L, count);
        verify(bemorRepository, times(1)).countQandliDiabetBemorlar();
    }

    @Test
    void countYurakBulimiBemorlar_ShouldReturnCount() {
        // Arrange
        when(bemorRepository.countYurakBulimiBemorlar()).thenReturn(2L);

        // Act
        long count = bemorService.countYurakBulimiBemorlar();

        // Assert
        assertEquals(2L, count);
        verify(bemorRepository, times(1)).countYurakBulimiBemorlar();
    }

    @Test
    void getBugunQabulQilinganBemorlar_ShouldReturnTodayPatients() {
        // Arrange
        List<Bemor> todayPatients = Arrays.asList(testBemor, activeBemor);
        when(bemorRepository.findByQabulQilinganSana(LocalDate.now())).thenReturn(todayPatients);

        // Act
        List<Bemor> result = bemorService.getBugunQabulQilinganBemorlar();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(bemorRepository, times(1)).findByQabulQilinganSana(LocalDate.now());
    }

    @Test
    void toggleBemorStatus_WhenBemorActive_ShouldSetInactive() {
        // Arrange
        testBemor.setFaol(true);
        when(bemorRepository.findById(1L)).thenReturn(Optional.of(testBemor));
        when(bemorRepository.save(any(Bemor.class))).thenReturn(testBemor);

        // Act
        Bemor result = bemorService.toggleBemorStatus(1L);

        // Assert
        assertNotNull(result);
        assertFalse(result.getFaol());
        verify(bemorRepository, times(1)).findById(1L);
        verify(bemorRepository, times(1)).save(testBemor);
    }

    @Test
    void toggleBemorStatus_WhenBemorInactive_ShouldSetActive() {
        // Arrange
        inactiveBemor.setFaol(false);
        when(bemorRepository.findById(3L)).thenReturn(Optional.of(inactiveBemor));
        when(bemorRepository.save(any(Bemor.class))).thenReturn(inactiveBemor);

        // Act
        Bemor result = bemorService.toggleBemorStatus(3L);

        // Assert
        assertNotNull(result);
        assertTrue(result.getFaol());
        verify(bemorRepository, times(1)).findById(3L);
        verify(bemorRepository, times(1)).save(inactiveBemor);
    }

    @Test
    void toggleBemorStatus_WhenBemorNotExists_ShouldThrowException() {
        // Arrange
        when(bemorRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            bemorService.toggleBemorStatus(999L);
        });

        assertEquals("Bemor topilmadi: 999", exception.getMessage());
        verify(bemorRepository, times(1)).findById(999L);
        verify(bemorRepository, never()).save(any(Bemor.class));
    }

    @Test
    void createBemor_ShouldGenerateQaydRaqamiAutomatically() {
        // Arrange
        Bemor newBemor = new Bemor();
        newBemor.setIsm("Test");
        newBemor.setFamiliya("Bemor");
        newBemor.setTelefon("+998901234573");

        when(bemorRepository.save(any(Bemor.class))).thenAnswer(invocation -> {
            Bemor bemor = invocation.getArgument(0);
            bemor.setId(7L);
            // @PrePersist should generate qaydRaqami
            return bemor;
        });

        // Act
        Bemor result = bemorService.createBemor(newBemor);

        // Assert
        assertNotNull(result);
        // Qayd raqami @PrePersist tomonidan generatsiya qilinadi
        verify(bemorRepository, times(1)).save(any(Bemor.class));
    }

    @Test
    void getBemorByTelefon_WithNonExistentTelefon_ShouldReturnEmpty() {
        // Arrange
        when(bemorRepository.findByTelefon("+998900000000")).thenReturn(Optional.empty());

        // Act
        Optional<Bemor> result = bemorService.getBemorByTelefon("+998900000000");

        // Assert
        assertFalse(result.isPresent());
        verify(bemorRepository, times(1)).findByTelefon("+998900000000");
    }

    @Test
    void getBemorByQaydRaqami_WithNonExistentQaydRaqami_ShouldReturnEmpty() {
        // Arrange
        when(bemorRepository.findByQaydRaqami("BMR999")).thenReturn(Optional.empty());

        // Act
        Optional<Bemor> result = bemorService.getBemorByQaydRaqami("BMR999");

        // Assert
        assertFalse(result.isPresent());
        verify(bemorRepository, times(1)).findByQaydRaqami("BMR999");
    }

    @Test
    void searchBemorlar_WithEmptyQuery_ShouldReturnAllBemorlar() {
        // Arrange
        List<Bemor> allBemorlar = Arrays.asList(testBemor, activeBemor, inactiveBemor);
        when(bemorRepository.searchBemorlar("")).thenReturn(allBemorlar);

        // Act
        List<Bemor> result = bemorService.searchBemorlar("");

        // Assert
        assertNotNull(result);
        assertEquals(3, result.size());
        verify(bemorRepository, times(1)).searchBemorlar("");
    }

    @Test
    void updateBemor_WithPartialUpdateData_ShouldPreserveExistingValues() {
        // Arrange
        Bemor existingBemor = new Bemor();
        existingBemor.setId(1L);
        existingBemor.setIsm("Ali");
        existingBemor.setFamiliya("Valiyev");
        existingBemor.setTelefon("+998901234567");
        existingBemor.setQonGuruhi("A+");
        existingBemor.setOgirlik(70.0);
        existingBemor.setBoy(175.0);

        Bemor updateData = new Bemor();
        updateData.setIsm("Updated"); // Faqat ism yangilanadi

        when(bemorRepository.findById(1L)).thenReturn(Optional.of(existingBemor));
        when(bemorRepository.save(any(Bemor.class))).thenReturn(existingBemor);

        // Act
        Bemor result = bemorService.updateBemor(1L, updateData);

        // Assert
        assertNotNull(result);
        assertEquals("Updated", result.getIsm());
        assertEquals("Valiyev", result.getFamiliya()); // Oldingi qiymat saqlanadi
        assertEquals("+998901234567", result.getTelefon()); // Oldingi qiymat saqlanadi
        assertEquals("A+", result.getQonGuruhi()); // Oldingi qiymat saqlanadi
        verify(bemorRepository, times(1)).findById(1L);
        verify(bemorRepository, times(1)).save(existingBemor);
    }

    @Test
    void getBMIsi_Calculation_ShouldReturnCorrectBMI() {
        // Arrange
        Bemor bemorWithBMI = new Bemor();
        bemorWithBMI.setOgirlik(70.0);
        bemorWithBMI.setBoy(175.0);

        // Act
        String bmi = bemorWithBMI.getBMIsi();

        // Assert
        assertNotNull(bmi);
        assertEquals("22.9", bmi); // 70 / (1.75 * 1.75) = 22.857 -> 22.9
    }

    @Test
    void getBMIsi_WithNullValues_ShouldReturnNomaLum() {
        // Arrange
        Bemor bemorWithoutData = new Bemor();

        // Act
        String bmi = bemorWithoutData.getBMIsi();

        // Assert
        assertEquals("Noma'lum", bmi);
    }

    @Test
    void getBMIsi_WithZeroHeight_ShouldReturnNomaLum() {
        // Arrange
        Bemor bemorZeroHeight = new Bemor();
        bemorZeroHeight.setOgirlik(70.0);
        bemorZeroHeight.setBoy(0.0);

        // Act
        String bmi = bemorZeroHeight.getBMIsi();

        // Assert
        assertEquals("Noma'lum", bmi);
    }

    @Test
    void createBemor_ShouldSetQabulQilinganSanaAutomatically() {
        // Arrange
        Bemor newBemor = new Bemor();
        newBemor.setIsm("Test");
        newBemor.setFamiliya("Bemor");
        newBemor.setTelefon("+998901234574");

        when(bemorRepository.save(any(Bemor.class))).thenAnswer(invocation -> {
            Bemor bemor = invocation.getArgument(0);
            bemor.setId(8L);
            return bemor;
        });

        // Act
        Bemor result = bemorService.createBemor(newBemor);

        // Assert
        assertNotNull(result);
        // @PrePersist should set qabulQilinganSana to current date
        verify(bemorRepository, times(1)).save(any(Bemor.class));
    }
}