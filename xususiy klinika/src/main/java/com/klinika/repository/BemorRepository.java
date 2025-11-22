package com.klinika.repository;

import com.klinika.entity.Bemor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BemorRepository extends JpaRepository<Bemor, Long> {
    
    Optional<Bemor> findByTelefon(String telefon);
    
    Optional<Bemor> findByQaydRaqami(String qaydRaqami);
    
    List<Bemor> findByQandliDiabetTrue();
    
    List<Bemor> findByYurakBulimiTrue();
    
    List<Bemor> findByQonGuruhi(String qonGuruhi);
    
    @Query("SELECT b FROM Bemor b WHERE b.ism LIKE %:query% OR b.familiya LIKE %:query% OR b.telefon LIKE %:query% OR b.qaydRaqami LIKE %:query%")
    List<Bemor> searchBemorlar(@Param("query") String query);
    
    @Query("SELECT COUNT(b) FROM Bemor b WHERE b.qabulQilinganSana BETWEEN :boshlanishSanasi AND :tugashSanasi")
    long countByQabulQilinganSanaBetween(@Param("boshlanishSanasi") LocalDate boshlanishSanasi, 
                                        @Param("tugashSanasi") LocalDate tugashSanasi);
    
    @Query("SELECT b FROM Bemor b WHERE b.qabulQilinganSana = :sana")
    List<Bemor> findByQabulQilinganSana(@Param("sana") LocalDate sana);
    
    @Query("SELECT b FROM Bemor b WHERE b.tugilganSana BETWEEN :boshlanishSanasi AND :tugashSanasi")
    List<Bemor> findByTugilganSanaBetween(@Param("boshlanishSanasi") LocalDate boshlanishSanasi, 
                                         @Param("tugashSanasi") LocalDate tugashSanasi);
    
    @Query("SELECT COUNT(b) FROM Bemor b WHERE b.qandliDiabet = true")
    long countQandliDiabetBemorlar();
    
    @Query("SELECT COUNT(b) FROM Bemor b WHERE b.yurakBulimi = true")
    long countYurakBulimiBemorlar();
    
    @Query("SELECT b.qonGuruhi, COUNT(b) FROM Bemor b GROUP BY b.qonGuruhi")
    List<Object[]> countBemorlarByQonGuruhi();
}