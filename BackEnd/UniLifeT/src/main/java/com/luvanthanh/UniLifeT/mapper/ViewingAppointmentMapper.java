package com.luvanthanh.UniLifeT.mapper;

import com.luvanthanh.UniLifeT.dto.response.viewingAppointmentResponse.ViewingAppointmentResponse;
import com.luvanthanh.UniLifeT.entity.ViewingAppointment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ViewingAppointmentMapper {
    @Mapping(target = "studentId", source = "student.userId")
    @Mapping(target = "studentName", source = "student.userName")
    @Mapping(target = "studentPhone", source = "student.userPhone")
    @Mapping(target = "roomId", source = "room.roomId")
    @Mapping(target = "motelId", source = "room.motel.motelId")
    @Mapping(target = "motelName", source = "room.motel.motelName")
    ViewingAppointmentResponse toViewingAppointmentResponse(ViewingAppointment appointment);
}
