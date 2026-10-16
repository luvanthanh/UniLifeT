package com.luvanthanh.UniLifeT.reponsitory;

import com.luvanthanh.UniLifeT.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

}
