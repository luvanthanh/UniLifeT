package com.luvanthanh.UniLifeT.dto.response.roomAmenityResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomAmenityResponse {
    private Long roomAmenityId;
    private Long roomId;
    private Long amenityId;
    private Integer amenityQuantity;
}
