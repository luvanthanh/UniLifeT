package com.luvanthanh.UniLifeT.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.*;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.OneToMany;

@Entity
@Data
@Table(name="motels")
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
    private String motelName;
    private String motelAddress;
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
    private List<MotelImage> images = new ArrayList<>();

}
