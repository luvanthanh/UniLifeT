package com.luvanthanh.UniLifeT.dto.response.authenticatedResponse;

import lombok.*;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IntrospectResponse {
    private Boolean checkToken;
}
