package com.luvanthanh.UniLifeT.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
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

    private String userName;
    private String userEmail;
    private String userPassword;
    private String userPhone;
    private String userAvatar;
    private String userGender;
    private LocalDate userBirthday;
    private String userAddress;
    private String userRole;

    @OneToMany(mappedBy = "user")
    private List<Motel> motels = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<UserRoom> userRooms = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Post> posts = new ArrayList<>();

}
