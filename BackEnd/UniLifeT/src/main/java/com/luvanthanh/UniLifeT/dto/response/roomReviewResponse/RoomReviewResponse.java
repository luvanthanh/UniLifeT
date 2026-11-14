package com.luvanthanh.UniLifeT.dto.response.roomReviewResponse;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class RoomReviewResponse {
    private Long reviewId;
    private Long userRoomId;
    private Long studentId;
    private String studentName;
    private Long roomId;
    private Short rating;
    private String reviewContent;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
