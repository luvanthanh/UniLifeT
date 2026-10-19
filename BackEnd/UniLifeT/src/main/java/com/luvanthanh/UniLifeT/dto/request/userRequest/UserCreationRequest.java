package com.luvanthanh.UniLifeT.dto.request.userRequest;

import lombok.*;

import java.time.LocalDate;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserCreationRequest {
    private String userName;
    private String userEmail;
    private String userPassword;
    private String userPhone;
    private String userAvatar;
    private String userGender;
    private LocalDate userBirthday;
    private String userAddress;
    private String userRole;
}
