package com.luvanthanh.UniLifeT.dto.response.image;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomImageResponse {
    private Long imageId;
    private Long roomId;
    private String imageName;
    private String imageUrl;
}
