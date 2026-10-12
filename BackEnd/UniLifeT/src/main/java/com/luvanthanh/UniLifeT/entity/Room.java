package com.luvanthanh.UniLifeT.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Long roomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "motel_id", nullable = false)
    private Motel motel;

    @Column(name = "room_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal roomPrice;

    @Column(name = "room_deposit", precision = 12, scale = 2)
    private BigDecimal roomDeposit = BigDecimal.ZERO;

    @Column(name = "room_area")
    private Double roomArea;

    @Column(name = "room_address", length = 255)
    private String roomAddress;

    @Column(name = "room_type", length = 100)
    private String roomType;

    @Column(name = "room_status", length = 100)
    private String roomStatus;

    @Column(name = "room_descrition", length = 6000)
    private String roomDescription;

    @OneToMany(mappedBy = "room")
    private List<UserRoom> userRooms = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "room_services",
            joinColumns = @JoinColumn(name = "room_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private List<UtilityService> services = new ArrayList<>();

    @OneToMany(mappedBy = "room")
    private List<RoomAmenity> roomAmenities = new ArrayList<>();

    @OneToMany(mappedBy = "room")
    private List<Post> posts = new ArrayList<>();

    @OneToMany(mappedBy = "room")
    private List<Image> images = new ArrayList<>();
}
