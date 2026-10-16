package com.luvanthanh.UniLifeT.reponsitory;

import com.luvanthanh.UniLifeT.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity,Integer> {

}
