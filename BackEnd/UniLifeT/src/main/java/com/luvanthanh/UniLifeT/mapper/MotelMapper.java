package com.luvanthanh.UniLifeT.mapper;

import com.luvanthanh.UniLifeT.dto.request.motelRequest.MotelCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.motelRequest.MotelUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.motelResponse.MotelResponse;
import com.luvanthanh.UniLifeT.entity.Motel;
import com.luvanthanh.UniLifeT.entity.University;
import java.util.ArrayList;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "Spring")
public interface MotelMapper {
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "rooms", ignore = true)
    @Mapping(target = "universities", ignore = true)
    @Mapping(target = "images", ignore = true)
    Motel toMotel(MotelCreationRequest request);

    @Mapping(target = "userId", source = "user.userId")
    @Mapping(target = "universityIds", source = "universities")
    MotelResponse toMotelResponse(Motel motel);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "rooms", ignore = true)
    @Mapping(target = "universities", ignore = true)
    @Mapping(target = "images", ignore = true)
    Motel toMotelUpdate(@MappingTarget Motel motel, MotelUpdateRequest request);

    default List<Long> mapUniversitiesToIds(List<University> universities) {
        List<Long> universityIds = new ArrayList<>();
        for (University university : universities) {
            universityIds.add(university.getUniversityId());
        }
        return universityIds;
    }
}
