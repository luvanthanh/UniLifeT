package com.luvanthanh.UniLifeT.repository.image;

import com.luvanthanh.UniLifeT.entity.MotelImage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MotelImageRepository extends JpaRepository<MotelImage, Long> {
    List<MotelImage> findByMotel_MotelId(Long motelId);
}
