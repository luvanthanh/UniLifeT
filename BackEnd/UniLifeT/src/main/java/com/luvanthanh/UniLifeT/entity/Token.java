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

    private String tokenValue;
    private LocalDateTime tokenExpiryTime;

}
