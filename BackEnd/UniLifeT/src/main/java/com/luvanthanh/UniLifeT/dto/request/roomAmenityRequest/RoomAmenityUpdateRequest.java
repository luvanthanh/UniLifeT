package com.luvanthanh.UniLifeT.dto.request.roomAmenityRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomAmenityUpdateRequest {
    private Long roomId;
    private Long amenityId;
    private Integer amenityQuantity;
}
