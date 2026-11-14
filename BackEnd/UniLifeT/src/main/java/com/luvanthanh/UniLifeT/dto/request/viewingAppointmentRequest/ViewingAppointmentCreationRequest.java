package com.luvanthanh.UniLifeT.dto.request.viewingAppointmentRequest;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ViewingAppointmentCreationRequest {
    private Long roomId;
    private LocalDateTime requestedAt;
    private String message;
}
