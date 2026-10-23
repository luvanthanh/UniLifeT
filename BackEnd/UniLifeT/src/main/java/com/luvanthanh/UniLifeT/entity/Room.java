package com.luvanthanh.UniLifeT.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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

    private BigDecimal roomPrice;
    private BigDecimal roomDeposit;
    private Double roomArea;
    private String roomAddress;
    private String roomType;
    private String roomStatus;
    private int roomView;
    private String roomDescription;

    @OneToMany(mappedBy = "room")
    private List<UserRoom> userRooms = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "room_services",
            joinColumns = @JoinColumn(name = "room_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private List<Service> services = new ArrayList<>();

    @OneToMany(mappedBy = "room")
    private List<RoomAmenity> roomAmenities = new ArrayList<>();

    @OneToMany(mappedBy = "room")
    private List<Post> posts = new ArrayList<>();

    @OneToMany(mappedBy = "room")
    private List<RoomImage> images = new ArrayList<>();
}
