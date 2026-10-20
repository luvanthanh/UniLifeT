package com.luvanthanh.UniLifeT.controller;


import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.imageRequest.ImageCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.imageRequest.ImageUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.imageResponse.ImageResponse;
import com.luvanthanh.UniLifeT.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/images")
public class ImageController {

    @Autowired
    private ImageService imageService;

    @PostMapping
    public ApiResponse<ImageResponse> createImage(@RequestBody ImageCreationRequest request) {
        var result = imageService.createImage(request);
        return ApiResponse.<ImageResponse>builder()
                .code(1000)
                .message("Image created successfully")
                .data(result)
                .build();
    }

    @PutMapping("/update/{imageId}")
    public ApiResponse<ImageResponse> updateImage(
            @PathVariable Long imageId, @RequestBody ImageUpdateRequest request) {
        var result = imageService.updateImage(imageId, request);
        return ApiResponse.<ImageResponse>builder()
                .code(1000)
                .message("Image updated successfully")
                .data(result)
                .build();
    }

    @GetMapping
    public ApiResponse<List<ImageResponse>> getAllImages() {
        var result = imageService.findAllImages();
        return ApiResponse.<List<ImageResponse>>builder()
                .code(1000)
                .message("Get all images successful")
                .data(result)
                .build();
    }

    @GetMapping("/{imageId}")
    public ApiResponse<ImageResponse> getImageById(@PathVariable Long imageId) {
        var result = imageService.findImageById(imageId);
        return ApiResponse.<ImageResponse>builder()
                .code(1000)
                .message("Get image successful")
                .data(result)
                .build();
    }

    @DeleteMapping("/{imageId}")
    public ApiResponse<String> deleteImage(@PathVariable Long imageId) {
        var result = imageService.deleteImage(imageId);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Delete image successful")
                .data(result)
                .build();
    }
}
