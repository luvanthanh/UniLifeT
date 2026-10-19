package com.luvanthanh.UniLifeT.reponsitory;

import com.luvanthanh.UniLifeT.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Image,Long   > {

}
