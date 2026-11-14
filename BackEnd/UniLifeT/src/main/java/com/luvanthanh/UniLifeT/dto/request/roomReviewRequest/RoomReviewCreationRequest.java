package com.luvanthanh.UniLifeT.dto.request.roomReviewRequest;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RoomReviewCreationRequest {
    private Long userRoomId;
    private Integer rating;
    private String reviewContent;
}
