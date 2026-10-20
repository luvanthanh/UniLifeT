package com.luvanthanh.UniLifeT.controller;


import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.serviceRequest.ServiceCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.serviceRequest.ServiceUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.serviceResponse.ServiceResponse;
import com.luvanthanh.UniLifeT.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    @PostMapping
    public ApiResponse<ServiceResponse> createService(@RequestBody ServiceCreationRequest request) {
        var result = serviceService.createService(request);
        return ApiResponse.<ServiceResponse>builder()
                .code(1000)
                .message("Service created successfully")
                .data(result)
                .build();
    }

    @PutMapping("/update/{serviceId}")
    public ApiResponse<ServiceResponse> updateService(
            @PathVariable Long serviceId, @RequestBody ServiceUpdateRequest request) {
        var result = serviceService.updateService(serviceId, request);
        return ApiResponse.<ServiceResponse>builder()
                .code(1000)
                .message("Service updated successfully")
                .data(result)
                .build();
    }

    @GetMapping
    public ApiResponse<List<ServiceResponse>> getAllServices() {
        var result = serviceService.findAllServices();
        return ApiResponse.<List<ServiceResponse>>builder()
                .code(1000)
                .message("Get all services successful")
                .data(result)
                .build();
    }

    @GetMapping("/{serviceId}")
    public ApiResponse<ServiceResponse> getServiceById(@PathVariable Long serviceId) {
        var result = serviceService.findServiceById(serviceId);
        return ApiResponse.<ServiceResponse>builder()
                .code(1000)
                .message("Get service successful")
                .data(result)
                .build();
    }

    @DeleteMapping("/{serviceId}")
    public ApiResponse<String> deleteService(@PathVariable Long serviceId) {
        var result = serviceService.deleteService(serviceId);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Delete service successful")
                .data(result)
                .build();
    }
}
