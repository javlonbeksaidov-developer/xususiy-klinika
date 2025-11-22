package com.klinika.repository;

import com.klinika.entity.Doktor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoktorRepository extends JpaRepository<Doktor, Long> {
    
    Optional<Doktor> findByTelefon(String telefon);
    
    List<Doktor> findByMutaxassislik(String mutaxassislik);
    
    List<Doktor> findByFaolTrue();
    
    List<Doktor> findByMutaxassislikAndFaolTrue(String mutaxassislik);
    
    @Query("SELECT d FROM Doktor d WHERE d.ism LIKE %:query% OR d.familiya LIKE %:query% OR d.mutaxassislik LIKE %:query%")
    List<Doktor> searchDoktorlar(@Param("query") String query);
    
    @Query("SELECT d FROM Doktor d WHERE d.reyting >= :minReyting ORDER BY d.reyting DESC")
    List<Doktor> findByReytingGreaterThanEqual(@Param("minReyting") Double minReyting);
    
    @Query("SELECT d.mutaxassislik, COUNT(d) FROM Doktor d WHERE d.faol = true GROUP BY d.mutaxassislik")
    List<Object[]> countDoktorlarByMutaxassislik();
    
    @Query("SELECT d FROM Doktor d WHERE d.faol = true AND d.narxPerKonsultatsiya BETWEEN :minNarx AND :maxNarx")
    List<Doktor> findByNarxBetween(@Param("minNarx") Double minNarx, @Param("maxNarx") Double maxNarx);
    
    @Query("SELECT AVG(d.reyting) FROM Doktor d WHERE d.faol = true")
    Double findAverageReyting();
    
    @Query("SELECT d FROM Doktor d WHERE d.faol = true ORDER BY d.reyting DESC LIMIT 5")
    List<Doktor> findTop5ByReyting();
    
    @Query("SELECT COUNT(d) FROM Doktor d WHERE d.faol = true AND d.ishTajribasi >= :tajriba")
    long countByIshTajribasiGreaterThanEqual(@Param("tajriba") Integer tajriba);
}