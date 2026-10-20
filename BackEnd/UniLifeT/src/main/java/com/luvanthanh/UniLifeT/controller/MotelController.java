package com.luvanthanh.UniLifeT.controller;


import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.motelRequest.MotelCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.motelRequest.MotelUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.motelResponse.MotelResponse;
import com.luvanthanh.UniLifeT.service.MotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/motels")
public class MotelController {

    @Autowired
    private MotelService motelService;

    @PostMapping
    public ApiResponse<MotelResponse> createMotel(@RequestBody MotelCreationRequest request) {
        var result = motelService.createMotel(request);
        return ApiResponse.<MotelResponse>builder()
                .code(1000)
                .message("Motel created successfully")
                .data(result)
                .build();
    }

    @PutMapping("/update/{motelId}")
    public ApiResponse<MotelResponse> updateMotel(
            @PathVariable Long motelId, @RequestBody MotelUpdateRequest request) {
        var result = motelService.updateMotel(motelId, request);
        return ApiResponse.<MotelResponse>builder()
                .code(1000)
                .message("Motel updated successfully")
                .data(result)
                .build();
    }

    @GetMapping
    public ApiResponse<List<MotelResponse>> getAllMotels() {
        var result = motelService.findAllMotels();
        return ApiResponse.<List<MotelResponse>>builder()
                .code(1000)
                .message("Get all motels successful")
                .data(result)
                .build();
    }

    @GetMapping("/{motelId}")
    public ApiResponse<MotelResponse> getMotelById(@PathVariable Long motelId) {
        var result = motelService.findMotelById(motelId);
        return ApiResponse.<MotelResponse>builder()
                .code(1000)
                .message("Get motel successful")
                .data(result)
                .build();
    }

    @DeleteMapping("/{motelId}")
    public ApiResponse<String> deleteMotel(@PathVariable Long motelId) {
        var result = motelService.deleteMotel(motelId);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Delete motel successful")
                .data(result)
                .build();
    }
}
