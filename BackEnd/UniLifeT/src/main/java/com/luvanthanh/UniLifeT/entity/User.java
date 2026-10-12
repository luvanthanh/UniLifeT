package com.luvanthanh.UniLifeT.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_name", nullable = false, length = 100)
    private String userName;

    @Column(name = "user_email", nullable = false, unique = true, length = 100)
    private String userEmail;

    @Column(name = "user_password", nullable = false, length = 255)
    private String userPassword;

    @Column(name = "user_phone", length = 10)
    private String userPhone;

    @Column(name = "user_avatar", length = 500)
    private String userAvatar;

    @Column(name = "user_gender", length = 50)
    private String userGender;

    @Column(name = "user_birthday")
    private LocalDate userBirthday;

    @Column(name = "user_address", length = 255)
    private String userAddress;

    @Column(name = "user_role", nullable = false, length = 20)
    private String userRole = "STUDENT";

    @OneToMany(mappedBy = "user")
    private List<Motel> motels = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<UserRoom> userRooms = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Post> posts = new ArrayList<>();

}
