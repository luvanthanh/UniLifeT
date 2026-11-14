package com.luvanthanh.UniLifeT.repository;

import com.luvanthanh.UniLifeT.entity.Room;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByRoomId (Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Room r WHERE r.roomId = :roomId")
    Optional<Room> findByIdForUpdate(@Param("roomId") Long roomId);

    Optional<List<Room>> findByRoomPriceBetween(
            BigDecimal minPrice,
            BigDecimal maxPrice
    );

    @Query("""
    SELECT r FROM Room r
    WHERE (:minArea IS NULL OR r.roomArea >= :minArea)
      AND (:maxArea IS NULL OR r.roomArea <= :maxArea)
""")
    Optional<List<Room>> filterByArea(
            @Param("minArea") Double minArea,
            @Param("maxArea") Double maxArea
    );
}
