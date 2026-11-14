package com.luvanthanh.UniLifeT.dto.response.roomFavoriteResponse;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class RoomFavoriteResponse {
    private Long userId;
    private Long roomId;
    private String roomType;
    private String roomAddress;
    private String motelName;
    private LocalDateTime createdAt;
}
