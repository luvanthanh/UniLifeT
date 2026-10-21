package com.luvanthanh.UniLifeT.mapper.image;

import com.luvanthanh.UniLifeT.dto.request.image.MotelImageCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.image.MotelImageUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.image.MotelImageResponse;
import com.luvanthanh.UniLifeT.entity.MotelImage;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface MotelImageMapper {
    @Mapping(target = "imageId", ignore = true)
    @Mapping(target = "motel", ignore = true)
    MotelImage toMotelImage(MotelImageCreationRequest request);

    @Mapping(target = "motelId", source = "motel.motelId")
    MotelImageResponse toMotelImageResponse(MotelImage motelImage);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "imageId", ignore = true)
    @Mapping(target = "motel", ignore = true)
    void updateMotelImage(@MappingTarget MotelImage motelImage, MotelImageUpdateRequest request);
}
