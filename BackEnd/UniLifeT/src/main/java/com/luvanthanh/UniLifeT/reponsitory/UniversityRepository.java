package com.luvanthanh.UniLifeT.reponsitory;

import com.luvanthanh.UniLifeT.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UniversityRepository extends JpaRepository<University,String> {

}
