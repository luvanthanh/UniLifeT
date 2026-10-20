package com.luvanthanh.UniLifeT.dto.response.userRoomResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRoomResponse {
    private Long userRoomId;
    private Long userId;
    private Long roomId;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal monthlyRent;
    private String contractStatus;
}
