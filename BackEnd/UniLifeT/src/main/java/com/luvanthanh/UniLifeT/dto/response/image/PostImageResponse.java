package com.luvanthanh.UniLifeT.dto.response.image;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostImageResponse {
    private Long imageId;
    private Long postId;
    private String imageName;
    private String imageUrl;
}
