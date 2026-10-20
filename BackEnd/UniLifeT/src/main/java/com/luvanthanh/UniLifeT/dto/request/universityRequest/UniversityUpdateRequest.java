package com.luvanthanh.UniLifeT.dto.request.universityRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UniversityUpdateRequest {

    private String universityName;
    private String universityCode;
    private String universityAddress;
    private String universityCity;
    private String universityDistrict;
    private String universityLogo;
    private String universityWebsite;
    private String universityPhone;
    private String universityStatus;
}
