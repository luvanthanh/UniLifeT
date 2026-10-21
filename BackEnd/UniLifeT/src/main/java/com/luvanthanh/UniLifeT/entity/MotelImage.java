package com.luvanthanh.UniLifeT.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "motel_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MotelImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Long imageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "motel_id", nullable = false)
    private Motel motel;

    @Column(name = "image_name")
    private String imageName;

    @Column(name = "image_url", nullable = false, length = 2048)
    private String imageUrl;
}
