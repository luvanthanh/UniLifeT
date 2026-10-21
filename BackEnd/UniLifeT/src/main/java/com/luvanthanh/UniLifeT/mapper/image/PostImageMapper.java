package com.luvanthanh.UniLifeT.mapper.image;

import com.luvanthanh.UniLifeT.dto.request.image.PostImageCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.image.PostImageUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.image.PostImageResponse;
import com.luvanthanh.UniLifeT.entity.PostImage;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface PostImageMapper {
    @Mapping(target = "imageId", ignore = true)
    @Mapping(target = "post", ignore = true)
    PostImage toPostImage(PostImageCreationRequest request);

    @Mapping(target = "postId", source = "post.postId")
    PostImageResponse toPostImageResponse(PostImage postImage);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "imageId", ignore = true)
    @Mapping(target = "post", ignore = true)
    void updatePostImage(@MappingTarget PostImage postImage, PostImageUpdateRequest request);
}
