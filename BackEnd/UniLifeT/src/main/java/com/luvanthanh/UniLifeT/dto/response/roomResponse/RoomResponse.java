package com.luvanthanh.UniLifeT.dto.response.roomResponse;

import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    private Long roomId;
    private Long motelId;
    private BigDecimal roomPrice;
    private BigDecimal roomDeposit;
    private Double roomArea;
    private String roomAddress;
    private String roomType;
    private String roomStatus;
    private int roomView;
    private String roomDescription;
    private List<Long> serviceIds;
}
