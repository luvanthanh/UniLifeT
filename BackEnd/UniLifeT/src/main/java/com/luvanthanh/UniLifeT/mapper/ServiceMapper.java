package com.luvanthanh.UniLifeT.mapper;

import com.luvanthanh.UniLifeT.dto.request.serviceRequest.ServiceCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.serviceRequest.ServiceUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.serviceResponse.ServiceResponse;
import com.luvanthanh.UniLifeT.entity.Service;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "Spring")
public interface ServiceMapper {
    Service toService(ServiceCreationRequest request);
    ServiceResponse toServiceResponse(Service service);
    Service toServiceUpdate(@MappingTarget Service service, ServiceUpdateRequest request);
}
