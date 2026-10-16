package com.luvanthanh.UniLifeT.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.*;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name="tokens")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "token_id")
    private Long tokenId;

    @Column(name = "token_value", nullable = false, unique = true, length = 500)
    private String tokenValue;

    @Column(name = "token_expiry_time", nullable = false)
    private LocalDateTime tokenExpiryTime;

}
