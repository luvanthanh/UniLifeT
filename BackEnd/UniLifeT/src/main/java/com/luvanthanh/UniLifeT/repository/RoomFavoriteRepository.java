package com.luvanthanh.UniLifeT.repository;

import com.luvanthanh.UniLifeT.entity.RoomFavorite;
import com.luvanthanh.UniLifeT.entity.RoomFavoriteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomFavoriteRepository extends JpaRepository<RoomFavorite, RoomFavoriteId> {
    List<RoomFavorite> findByUser_UserIdOrderByCreatedAtDesc(Long userId);

    boolean existsByUser_UserIdAndRoom_RoomId(Long userId, Long roomId);

    void deleteByUser_UserIdAndRoom_RoomId(Long userId, Long roomId);
}
