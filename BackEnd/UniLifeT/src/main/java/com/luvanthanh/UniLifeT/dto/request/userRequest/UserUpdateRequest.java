package com.luvanthanh.UniLifeT.dto.request.userRequest;

import java.time.LocalDate;
import lombok.*;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserUpdateRequest {
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
