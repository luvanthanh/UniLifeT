package com.luvanthanh.UniLifeT.mapper;

import com.luvanthanh.UniLifeT.dto.request.roomServiceRequest.RoomServiceCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.roomServiceRequest.RoomServiceUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.roomServiceResponse.RoomServiceResponse;
import com.luvanthanh.UniLifeT.entity.RoomService;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "Spring")
public interface RoomServiceMapper {
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "service", ignore = true)
    RoomService toRoomService(RoomServiceCreationRequest request);

    @Mapping(target = "roomId", source = "room.roomId")
    @Mapping(target = "serviceId", source = "service.serviceId")
    RoomServiceResponse toRoomServiceResponse(RoomService roomService);

    @Mapping(target = "room", ignore = true)
    @Mapping(target = "service", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    RoomService toRoomServiceUpdate(@MappingTarget RoomService roomService, RoomServiceUpdateRequest request);
}
