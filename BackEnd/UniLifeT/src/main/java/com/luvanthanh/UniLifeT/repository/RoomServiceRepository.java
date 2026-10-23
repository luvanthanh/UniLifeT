package com.luvanthanh.UniLifeT.repository;


import com.luvanthanh.UniLifeT.entity.RoomService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomServiceRepository extends JpaRepository<RoomService,Long> {
    List<RoomService>  findByRoom_RoomId(Long roomId);
    boolean existsByRoom_RoomIdAndService_ServiceId(
            Long roomId, Long serviceId);
}
