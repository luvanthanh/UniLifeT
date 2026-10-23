package com.luvanthanh.UniLifeT.mapper;

import com.luvanthanh.UniLifeT.dto.request.roomAmenityRequest.RoomAmenityCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.roomAmenityRequest.RoomAmenityUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.roomAmenityResponse.RoomAmenityResponse;
import com.luvanthanh.UniLifeT.entity.RoomAmenity;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "Spring")
public interface RoomAmenityMapper {
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "amenity", ignore = true)
    RoomAmenity toRoomAmenity(RoomAmenityCreationRequest request);

    @Mapping(target = "roomId", source = "room.roomId")
    @Mapping(target = "amenityId", source = "amenity.amenityId")
    RoomAmenityResponse toRoomAmenityResponse(RoomAmenity roomAmenity);

    @Mapping(target = "room", ignore = true)
    @Mapping(target = "amenity", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    RoomAmenity toRoomAmenityUpdate(@MappingTarget RoomAmenity roomAmenity, RoomAmenityUpdateRequest request);
}
