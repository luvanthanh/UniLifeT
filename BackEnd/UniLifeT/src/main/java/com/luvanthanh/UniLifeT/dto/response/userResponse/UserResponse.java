package com.luvanthanh.UniLifeT.dto.response.userResponse;

import lombok.*;

import java.time.LocalDate;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {

    private String userName;
    private String userEmail;
    private String userPhone;
    private String userAvatar;
    private String userGender;
    private LocalDate userBirthday;
    private String userAddress;
    private String userRole;

}
