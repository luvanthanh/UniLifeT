package com.luvanthanh.UniLifeT.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "room_amenities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomAmenity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_amenity_id")
    private Long roomAmenityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "amenity_id", nullable = false)
    private Amenity amenity;

    @Column(name = "amenity_quantity", nullable = false)
    private Integer amenityQuantity = 1;
}
