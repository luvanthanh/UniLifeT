package com.luvanthanh.UniLifeT.mapper.image;

import com.luvanthanh.UniLifeT.dto.request.image.RoomImageCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.image.RoomImageUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.image.RoomImageResponse;
import com.luvanthanh.UniLifeT.entity.RoomImage;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface RoomImageMapper {
    @Mapping(target = "imageId", ignore = true)
    @Mapping(target = "room", ignore = true)
    RoomImage toRoomImage(RoomImageCreationRequest request);

    @Mapping(target = "roomId", source = "room.roomId")
    RoomImageResponse toRoomImageResponse(RoomImage roomImage);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "imageId", ignore = true)
    @Mapping(target = "room", ignore = true)
    void updateRoomImage(@MappingTarget RoomImage roomImage, RoomImageUpdateRequest request);
}
