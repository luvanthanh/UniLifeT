package com.luvanthanh.UniLifeT.dto.response.imageResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImageResponse {
    private Long imageId;
    private Long postId;
    private Long roomId;
    private Long motelId;
    private String imageName;
    private String imagesUrl;
}
