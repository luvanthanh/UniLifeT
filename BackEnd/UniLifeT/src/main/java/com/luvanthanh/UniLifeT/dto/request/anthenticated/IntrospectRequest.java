package com.luvanthanh.UniLifeT.dto.request.anthenticated;


import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class IntrospectRequest {
    private String token;
}
