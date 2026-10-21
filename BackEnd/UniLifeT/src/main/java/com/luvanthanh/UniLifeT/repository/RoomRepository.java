package com.luvanthanh.UniLifeT.repository;

import com.luvanthanh.UniLifeT.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByRoomId (Long id);
}
