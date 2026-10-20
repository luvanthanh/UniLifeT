package com.luvanthanh.UniLifeT.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "amenities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Amenity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "amenity_id")
    private Long amenityId;
    private String amenityName;

    @OneToMany(mappedBy = "amenity")
    private List<RoomAmenities> roomAmenities = new ArrayList<>();
}
