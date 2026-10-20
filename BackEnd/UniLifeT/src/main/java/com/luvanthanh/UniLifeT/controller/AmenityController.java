package com.luvanthanh.UniLifeT.controller;


import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.amenityRequest.AmenityCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.amenityRequest.AmenityUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.amenityResponse.AmenityResponse;
import com.luvanthanh.UniLifeT.service.AmenityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/amenities")
public class AmenityController {

    @Autowired
    private AmenityService amenityService;
// tạo mới tiện ích
    @PostMapping
    public ApiResponse<AmenityResponse> createAmenity(@RequestBody AmenityCreationRequest request) {
        var result = amenityService.createAmenity(request);
        return ApiResponse.<AmenityResponse>builder()
                .code(1000)
                .message("Amenity created successfully")
                .data(result)
                .build();
    }
// sửa tiện ích
    @PutMapping("/update/{amenityId}")
    public ApiResponse<AmenityResponse> updateAmenity(
            @PathVariable Long amenityId, @RequestBody AmenityUpdateRequest request) {
        var result = amenityService.updateAmenity(amenityId, request);
        return ApiResponse.<AmenityResponse>builder()
                .code(1000)
                .message("Amenity updated successfully")
                .data(result)
                .build();
    }
// lấy danh sách tiện ích
    @GetMapping
    public ApiResponse<List<AmenityResponse>> getAllAmenities() {
        var result = amenityService.findAllAmenities();
        return ApiResponse.<List<AmenityResponse>>builder()
                .code(1000)
                .message("Get all amenities successful")
                .data(result)
                .build();
    }
// lấy danh sách tiện ích theo id
    @GetMapping("/{amenityId}")
    public ApiResponse<AmenityResponse> getAmenityById(@PathVariable Long amenityId) {
        var result = amenityService.findAmenityById(amenityId);
        return ApiResponse.<AmenityResponse>builder()
                .code(1000)
                .message("Get amenity successful")
                .data(result)
                .build();
    }

//    xóa tiện ích theo ìd
    @DeleteMapping("/{amenityId}")
    public ApiResponse<String> deleteAmenity(@PathVariable Long amenityId) {
        var result = amenityService.deleteAmenity(amenityId);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Delete amenity successful")
                .data(result)
                .build();
    }
}
