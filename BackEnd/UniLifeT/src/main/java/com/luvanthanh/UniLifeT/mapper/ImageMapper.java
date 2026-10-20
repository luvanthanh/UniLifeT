package com.luvanthanh.UniLifeT.mapper;

import com.luvanthanh.UniLifeT.dto.request.imageRequest.ImageCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.imageRequest.ImageUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.imageResponse.ImageResponse;
import com.luvanthanh.UniLifeT.entity.Image;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "Spring")
public interface ImageMapper {
    @Mapping(target = "post", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "motel", ignore = true)
    Image toImage(ImageCreationRequest request);

    @Mapping(target = "postId", source = "post.postId")
    @Mapping(target = "roomId", source = "room.roomId")
    @Mapping(target = "motelId", source = "motel.motelId")
    ImageResponse toImageResponse(Image image);

    @Mapping(target = "post", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "motel", ignore = true)
    Image toImageUpdate(@MappingTarget Image image, ImageUpdateRequest request);
}
