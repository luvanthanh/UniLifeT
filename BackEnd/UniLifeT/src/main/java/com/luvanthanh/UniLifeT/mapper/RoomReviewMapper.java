package com.luvanthanh.UniLifeT.mapper;

import com.luvanthanh.UniLifeT.dto.response.roomReviewResponse.RoomReviewResponse;
import com.luvanthanh.UniLifeT.entity.RoomReview;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoomReviewMapper {
    @Mapping(target = "userRoomId", source = "userRoom.userRoomId")
    @Mapping(target = "studentId", source = "userRoom.user.userId")
    @Mapping(target = "studentName", source = "userRoom.user.userName")
    @Mapping(target = "roomId", source = "userRoom.room.roomId")
    RoomReviewResponse toRoomReviewResponse(RoomReview review);
}
