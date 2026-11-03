package com.luvanthanh.UniLifeT.entity;

import com.luvanthanh.UniLifeT.Enum.Role;
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
    @Column(name = "user_role", nullable = false)
    private String userRole;

    @PrePersist
    public void prePersist() {
        if (userRole == null || userRole.isBlank()) {
            userRole = Role.STUDENT.name();
        } else {
            userRole = userRole.trim().toUpperCase();
        }
    }

    @OneToMany(mappedBy = "user")
    private List<Motel> motels = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<UserRoom> userRooms = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Post> posts = new ArrayList<>();

}
