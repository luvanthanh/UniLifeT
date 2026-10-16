package com.luvanthanh.UniLifeT.dto.response.authenticatedResponse;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LogoutResponse {
    private Boolean checkLogout;
}
