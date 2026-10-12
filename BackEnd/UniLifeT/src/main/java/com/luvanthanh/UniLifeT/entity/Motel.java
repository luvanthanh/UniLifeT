package com.luvanthanh.UniLifeT.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Motel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "motel_id")
    private Long motelId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "motel_name", length = 200)
    private String motelName;

    @Column(name = "motel_address", length = 300)
    private String motelAddress;

    @Column(name = "motel_owner", length = 300)
    private String motelOwner;

    @OneToMany(mappedBy = "motel")
    private List<Room> rooms = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "motel_universities",
            joinColumns = @JoinColumn(name = "motel_id"),
            inverseJoinColumns = @JoinColumn(name = "university_id")
    )
    private List<University> universities = new ArrayList<>();

    @OneToMany(mappedBy = "motel")
    private List<Image> images = new ArrayList<>();


}
