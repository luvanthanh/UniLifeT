package com.luvanthanh.UniLifeT.repository;

import com.luvanthanh.UniLifeT.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Image,Long   > {

}
