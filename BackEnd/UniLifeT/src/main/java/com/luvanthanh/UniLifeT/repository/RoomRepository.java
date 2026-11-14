package com.luvanthanh.UniLifeT.repository;

import com.luvanthanh.UniLifeT.entity.Room;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query(value = """
            SELECT DISTINCT r FROM Room r
            LEFT JOIN r.motel m
            LEFT JOIN m.universities u
            LEFT JOIN r.roomAmenities ra
            LEFT JOIN ra.amenity a
            LEFT JOIN r.services s
            WHERE (:minPrice IS NULL OR r.roomPrice >= :minPrice)
              AND (:maxPrice IS NULL OR r.roomPrice <= :maxPrice)
              AND (:minArea IS NULL OR r.roomArea >= :minArea)
              AND (:maxArea IS NULL OR r.roomArea <= :maxArea)
              AND (:status IS NULL OR UPPER(r.roomStatus) = UPPER(:status))
              AND (:roomType IS NULL OR UPPER(r.roomType) = UPPER(:roomType))
              AND (:universityId IS NULL OR u.universityId = :universityId)
              AND (:amenityId IS NULL OR a.amenityId = :amenityId)
              AND (:serviceId IS NULL OR s.serviceId = :serviceId)
            """,
            countQuery = """
            SELECT COUNT(DISTINCT r.roomId) FROM Room r
            LEFT JOIN r.motel m
            LEFT JOIN m.universities u
            LEFT JOIN r.roomAmenities ra
            LEFT JOIN ra.amenity a
            LEFT JOIN r.services s
            WHERE (:minPrice IS NULL OR r.roomPrice >= :minPrice)
              AND (:maxPrice IS NULL OR r.roomPrice <= :maxPrice)
              AND (:minArea IS NULL OR r.roomArea >= :minArea)
              AND (:maxArea IS NULL OR r.roomArea <= :maxArea)
              AND (:status IS NULL OR UPPER(r.roomStatus) = UPPER(:status))
              AND (:roomType IS NULL OR UPPER(r.roomType) = UPPER(:roomType))
              AND (:universityId IS NULL OR u.universityId = :universityId)
              AND (:amenityId IS NULL OR a.amenityId = :amenityId)
              AND (:serviceId IS NULL OR s.serviceId = :serviceId)
            """)
    Page<Room> searchRooms(
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minArea") Double minArea,
            @Param("maxArea") Double maxArea,
            @Param("status") String status,
            @Param("roomType") String roomType,
            @Param("universityId") Long universityId,
            @Param("amenityId") Long amenityId,
            @Param("serviceId") Long serviceId,
            Pageable pageable
    );

    List<Room> findByMotel_User_UserId(Long ownerId);
}
