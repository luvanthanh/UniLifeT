package com.luvanthanh.UniLifeT.dto.request.anthenticated;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class AuthenticationRequest {
    private  String userName;
    private String userPassword;
}
