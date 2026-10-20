package com.luvanthanh.UniLifeT.mapper;

import com.luvanthanh.UniLifeT.dto.request.amenityRequest.AmenityCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.amenityRequest.AmenityUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.amenityResponse.AmenityResponse;
import com.luvanthanh.UniLifeT.entity.Amenity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "Spring")
public interface AmenityMapper {
    Amenity toAmenity(AmenityCreationRequest request);
    AmenityResponse toAmenityResponse(Amenity amenity);
    Amenity toAmenityUpdate(@MappingTarget Amenity amenity, AmenityUpdateRequest request);
}
