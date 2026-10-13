package com.luvanthanh.UniLifeT.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "universities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class University {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "university_id")
    private Long universityId;

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

