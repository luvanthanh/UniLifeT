package com.luvanthanh.UniLifeT.dto.request.image;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomImageCreationRequest {
    private Long roomId;
    private String imageName;
    private String imageUrl;
}
