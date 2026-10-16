package com.luvanthanh.UniLifeT.dto.request.anthenticated;


import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LogoutRequest {
    private String token;
}
