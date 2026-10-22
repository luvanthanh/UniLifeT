package com.luvanthanh.UniLifeT.repository;

import com.luvanthanh.UniLifeT.entity.UserRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRoomRepository extends JpaRepository<UserRoom, Long> {
    List<UserRoom>  findByUser_UserId(Long userId);
}
