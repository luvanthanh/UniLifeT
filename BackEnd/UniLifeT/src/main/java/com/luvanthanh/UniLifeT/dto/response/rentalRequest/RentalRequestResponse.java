package com.luvanthanh.UniLifeT.dto.response.rentalRequest;

import com.luvanthanh.UniLifeT.Enum.RentalRequestStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class RentalRequestResponse {
    private Long rentalRequestId;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentPhone;
    private Long roomId;
    private LocalDate requestedStartDate;
    private BigDecimal requestedRent;
    private String message;
    private RentalRequestStatus status;
    private LocalDateTime createdAt;
}
