package com.luvanthanh.UniLifeT.dto.request.serviceRequest;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCreationRequest {
    private String serviceName;
    private int serviceTime;
    private BigDecimal servicePrice;
    private String serviceIcon;
    private String serviceStatus;
}
