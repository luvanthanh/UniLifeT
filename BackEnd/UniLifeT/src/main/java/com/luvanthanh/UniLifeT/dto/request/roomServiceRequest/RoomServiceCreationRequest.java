package com.luvanthanh.UniLifeT.dto.request.roomServiceRequest;


import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.*;
@Data
@AllArgsConstructor
@NoArgsConstructor

public class RoomServiceCreationRequest {
    private Long roomId;
    private Long  serviceId;
}
