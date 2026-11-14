package com.luvanthanh.UniLifeT.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class RoomFavoriteId implements Serializable {
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "room_id")
    private Long roomId;
}
