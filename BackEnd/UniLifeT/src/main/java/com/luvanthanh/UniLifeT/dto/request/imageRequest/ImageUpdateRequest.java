package com.luvanthanh.UniLifeT.dto.request.imageRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImageUpdateRequest {
    private Long postId;
    private Long roomId;
    private Long motelId;
    private String imageName;
    private String imagesUrl;
}
