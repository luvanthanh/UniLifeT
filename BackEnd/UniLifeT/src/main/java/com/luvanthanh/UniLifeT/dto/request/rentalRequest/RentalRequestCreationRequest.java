package com.luvanthanh.UniLifeT.dto.request.rentalRequest;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class RentalRequestCreationRequest {
    private Long roomId;
    private LocalDate requestedStartDate;
    private String message;
}
