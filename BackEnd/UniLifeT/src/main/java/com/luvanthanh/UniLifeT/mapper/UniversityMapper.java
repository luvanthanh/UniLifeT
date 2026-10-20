package com.luvanthanh.UniLifeT.mapper;


import com.luvanthanh.UniLifeT.dto.request.universityRequest.UniversityCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.universityRequest.UniversityUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.universityResponse.UniversityResponse;
import com.luvanthanh.UniLifeT.entity.University;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "Spring")
public interface UniversityMapper {
    University toUniversity (UniversityCreationRequest request);
    UniversityResponse toUniversityResponse (University university);
    University toUniversityUpdate (@MappingTarget University university, UniversityUpdateRequest request);
}
