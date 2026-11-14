package com.luvanthanh.UniLifeT.mapper;

import com.luvanthanh.UniLifeT.dto.response.roomFavoriteResponse.RoomFavoriteResponse;
import com.luvanthanh.UniLifeT.entity.RoomFavorite;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoomFavoriteMapper {
    @Mapping(target = "userId", source = "user.userId")
    @Mapping(target = "roomId", source = "room.roomId")
    @Mapping(target = "roomType", source = "room.roomType")
    @Mapping(target = "roomAddress", source = "room.roomAddress")
    @Mapping(target = "motelName", source = "room.motel.motelName")
    RoomFavoriteResponse toRoomFavoriteResponse(RoomFavorite roomFavorite);
}
