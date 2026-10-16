package com.luvanthanh.UniLifeT.dto.response.authenticatedResponse;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticationResponse {
    private boolean checkAuthenticated;
    private Long userId;
    private String token;
}
