package com.luvanthanh.UniLifeT.repository;


import com.luvanthanh.UniLifeT.entity.RoomAmenity;
import org.hibernate.boot.models.JpaAnnotations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomAmenityRepository extends JpaRepository<RoomAmenity, Long> {

}
