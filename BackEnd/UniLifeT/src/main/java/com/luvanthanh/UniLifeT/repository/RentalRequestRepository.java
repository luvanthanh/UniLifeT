package com.luvanthanh.UniLifeT.repository;

import com.luvanthanh.UniLifeT.Enum.RentalRequestStatus;
import com.luvanthanh.UniLifeT.entity.RentalRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RentalRequestRepository extends JpaRepository<RentalRequest, Long> {
    List<RentalRequest> findByStudent_UserIdOrderByCreatedAtDesc(Long studentId);

    List<RentalRequest> findByRoom_Motel_User_UserIdOrderByCreatedAtDesc(Long ownerId);

    List<RentalRequest> findByStudent_UserIdAndStatusOrderByCreatedAtDesc(Long studentId, RentalRequestStatus status);

    List<RentalRequest> findByRoom_Motel_User_UserIdAndStatusOrderByCreatedAtDesc(Long ownerId, RentalRequestStatus status);

    List<RentalRequest> findByStatusOrderByCreatedAtDesc(RentalRequestStatus status);

    List<RentalRequest> findAllByOrderByCreatedAtDesc();

    List<RentalRequest> findByRoom_RoomIdAndStatus(Long roomId, RentalRequestStatus status);

    boolean existsByStudent_UserIdAndRoom_RoomIdAndStatus(
            Long studentId,
            Long roomId,
            RentalRequestStatus status
    );
}
