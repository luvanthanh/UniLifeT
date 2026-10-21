package com.luvanthanh.UniLifeT.dto.request.image;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostImageCreationRequest {
    private Long postId;
    private String imageName;
    private String imageUrl;
}
