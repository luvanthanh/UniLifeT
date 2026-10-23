package com.luvanthanh.UniLifeT.dto.request.roomServiceRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomServiceUpdateRequest {
    private Long roomId;
    private Long serviceId;
}
