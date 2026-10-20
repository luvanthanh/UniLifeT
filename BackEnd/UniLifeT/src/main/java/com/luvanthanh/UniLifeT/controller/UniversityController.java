package com.luvanthanh.UniLifeT.controller;


import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.universityRequest.UniversityCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.universityRequest.UniversityUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.universityResponse.UniversityResponse;
import com.luvanthanh.UniLifeT.service.UniversityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/universities")
public class UniversityController {

    @Autowired
    private UniversityService universityService;

    @PostMapping
    public ApiResponse<UniversityResponse> createUniversity(@RequestBody UniversityCreationRequest request) {
        var result = universityService.createUniversity(request);
        return ApiResponse.<UniversityResponse>builder()
                .code(1000)
                .message("University created successfully")
                .data(result)
                .build();
    }

    @PutMapping("/update/{universityId}")
    public ApiResponse<UniversityResponse> updateUniversity(
            @PathVariable Long universityId, @RequestBody UniversityUpdateRequest request) {
        var result = universityService.updateUniversity(universityId, request);
        return ApiResponse.<UniversityResponse>builder()
                .code(1000)
                .message("University updated successfully")
                .data(result)
                .build();
    }

    @GetMapping
    public ApiResponse<List<UniversityResponse>> getAllUniversities() {
        var result = universityService.findAllUniversities();
        return ApiResponse.<List<UniversityResponse>>builder()
                .code(1000)
                .message("Get all universities successful")
                .data(result)
                .build();
    }

    @GetMapping("/{universityId}")
    public ApiResponse<UniversityResponse> getUniversityById(@PathVariable Long universityId) {
        var result = universityService.findUniversityById(universityId);
        return ApiResponse.<UniversityResponse>builder()
                .code(1000)
                .message("Get university successful")
                .data(result)
                .build();
    }

    @DeleteMapping("/{universityId}")
    public ApiResponse<String> deleteUniversity(@PathVariable Long universityId) {
        var result = universityService.deleteUniversity(universityId);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Delete university successful")
                .data(result)
                .build();
    }
}
