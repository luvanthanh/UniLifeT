package com.luvanthanh.UniLifeT.service;


import com.luvanthanh.UniLifeT.dto.request.serviceRequest.ServiceCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.serviceRequest.ServiceUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.serviceResponse.ServiceResponse;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.ServiceMapper;
import com.luvanthanh.UniLifeT.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ServiceMapper serviceMapper;

    public ServiceResponse createService(ServiceCreationRequest request) {
        com.luvanthanh.UniLifeT.entity.Service service = serviceMapper.toService(request);
        return serviceMapper.toServiceResponse(serviceRepository.save(service));
    }

    public List<ServiceResponse> findAllServices() {
        List<com.luvanthanh.UniLifeT.entity.Service> services = serviceRepository.findAll();
        List<ServiceResponse> serviceResponseList = new ArrayList<>();
        for (com.luvanthanh.UniLifeT.entity.Service service : services) {
            serviceResponseList.add(serviceMapper.toServiceResponse(service));
        }
        return serviceResponseList;
    }

    public ServiceResponse findServiceById(Long serviceId) {
        com.luvanthanh.UniLifeT.entity.Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        return serviceMapper.toServiceResponse(service);
    }

    public ServiceResponse updateService(Long serviceId, ServiceUpdateRequest request) {
        com.luvanthanh.UniLifeT.entity.Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        serviceMapper.toServiceUpdate(service, request);
        return serviceMapper.toServiceResponse(serviceRepository.save(service));
    }

    public String deleteService(Long serviceId) {
        com.luvanthanh.UniLifeT.entity.Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        serviceRepository.delete(service);
        return "Service Deleted Successfully";
    }
}
