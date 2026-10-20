package com.luvanthanh.UniLifeT.mapper;

import com.luvanthanh.UniLifeT.dto.request.userRoomRequest.UserRoomCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.userRoomRequest.UserRoomUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.userRoomResponse.UserRoomResponse;
import com.luvanthanh.UniLifeT.entity.UserRoom;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "Spring")
public interface UserRoomMapper {
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "room", ignore = true)
    UserRoom toUserRoom(UserRoomCreationRequest request);

    @Mapping(target = "userId", source = "user.userId")
    @Mapping(target = "roomId", source = "room.roomId")
    UserRoomResponse toUserRoomResponse(UserRoom userRoom);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "room", ignore = true)
    UserRoom toUserRoomUpdate(@MappingTarget UserRoom userRoom, UserRoomUpdateRequest request);
}
