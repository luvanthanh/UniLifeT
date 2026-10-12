package com.luvanthanh.UniLifeT.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "room_amenities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomAmenities {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "amenity_id", nullable = false)
    private Amenity amenity;

    @Column(name = "amenity_quantity", nullable = false)
    private Integer amenityQuantity = 1;
}
