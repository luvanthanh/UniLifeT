package com.luvanthanh.UniLifeT.repository.image;

import com.luvanthanh.UniLifeT.entity.RoomImage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomImageRepository extends JpaRepository<RoomImage, Long> {
    List<RoomImage> findByRoom_RoomId(Long roomId);
}
