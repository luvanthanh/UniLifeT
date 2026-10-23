package com.luvanthanh.UniLifeT.repository;

import com.luvanthanh.UniLifeT.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UniversityRepository extends JpaRepository<University,Long> {
    boolean existsByUniversityCodeAndUniversityIdNot(
            String universityCode,
            Long universityId
    );
}
