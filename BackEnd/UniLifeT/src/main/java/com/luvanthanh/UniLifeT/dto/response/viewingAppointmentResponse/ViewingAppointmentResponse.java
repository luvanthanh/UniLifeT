package com.luvanthanh.UniLifeT.dto.response.viewingAppointmentResponse;

import com.luvanthanh.UniLifeT.Enum.ViewingAppointmentStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ViewingAppointmentResponse {
    private Long appointmentId;
    private Long studentId;
    private String studentName;
    private String studentPhone;
    private Long roomId;
    private Long motelId;
    private String motelName;
    private LocalDateTime requestedAt;
    private LocalDateTime scheduledAt;
    private ViewingAppointmentStatus status;
    private String message;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
