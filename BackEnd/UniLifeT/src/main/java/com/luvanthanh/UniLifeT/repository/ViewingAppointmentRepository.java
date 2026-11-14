package com.luvanthanh.UniLifeT.repository;

import com.luvanthanh.UniLifeT.entity.ViewingAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ViewingAppointmentRepository extends JpaRepository<ViewingAppointment, Long> {
    List<ViewingAppointment> findByStudent_UserIdOrderByCreatedAtDesc(Long studentId);

    List<ViewingAppointment> findByRoom_Motel_User_UserIdOrderByCreatedAtDesc(Long ownerId);
}
