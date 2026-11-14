package com.luvanthanh.UniLifeT.mapper;

import com.luvanthanh.UniLifeT.dto.response.rentalRequest.RentalRequestResponse;
import com.luvanthanh.UniLifeT.entity.RentalRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RentalRequestMapper {
    @Mapping(target = "studentId", source = "student.userId")
    @Mapping(target = "studentName", source = "student.userName")
    @Mapping(target = "studentEmail", source = "student.userEmail")
    @Mapping(target = "studentPhone", source = "student.userPhone")
    @Mapping(target = "roomId", source = "room.roomId")
    RentalRequestResponse toRentalRequestResponse(RentalRequest rentalRequest);
}
