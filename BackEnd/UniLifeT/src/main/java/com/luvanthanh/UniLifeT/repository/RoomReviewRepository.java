package com.luvanthanh.UniLifeT.repository;

import com.luvanthanh.UniLifeT.entity.RoomReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomReviewRepository extends JpaRepository<RoomReview, Long> {
    List<RoomReview> findByUserRoom_Room_RoomIdOrderByCreatedAtDesc(Long roomId);

    List<RoomReview> findByUserRoom_User_UserIdOrderByCreatedAtDesc(Long userId);

    List<RoomReview> findAllByOrderByCreatedAtDesc();

    boolean existsByUserRoom_UserRoomId(Long userRoomId);
}
