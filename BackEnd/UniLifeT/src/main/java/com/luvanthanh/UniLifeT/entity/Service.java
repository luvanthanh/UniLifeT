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
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Long serviceId;

    @Column(name = "service_name", nullable = false, unique = true, length = 100)
    private String serviceName;

    @Column(name = "service_price", precision = 12, scale = 2)
    private BigDecimal servicePrice;

    @Column(name = "service_icon", length = 255)
    private String serviceIcon;

    @Column(name = "service_status", length = 200)
    private String serviceStatus;

    @ManyToMany(mappedBy = "services")
    private List<Room> rooms = new ArrayList<>();
}

