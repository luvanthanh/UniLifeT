package com.luvanthanh.UniLifeT.dto.response.motelResponse;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MotelResponse {
    private Long motelId;
    private Long userId;
    private String motelName;
    private String motelAddress;
    private String motelOwner;
    private List<Long> universityIds;
}
