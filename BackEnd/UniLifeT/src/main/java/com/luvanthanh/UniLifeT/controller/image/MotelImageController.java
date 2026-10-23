package com.luvanthanh.UniLifeT.controller.image;

import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.image.MotelImageCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.image.MotelImageUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.image.MotelImageResponse;
import com.luvanthanh.UniLifeT.service.image.MotelImageService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/motel-images")
public class MotelImageController {

    @Autowired
    private MotelImageService motelImageService;

    @PostMapping
    public ApiResponse<MotelImageResponse> createMotelImage(@RequestBody MotelImageCreationRequest request) {
        return ApiResponse.<MotelImageResponse>builder()
                .code(1000)
                .message("Motel image created successfully")
                .data(motelImageService.createMotelImage(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<MotelImageResponse>> getAllMotelImages() {
        return ApiResponse.<List<MotelImageResponse>>builder()
                .code(1000)
                .message("Get all motel images successful")
                .data(motelImageService.findAllMotelImages())
                .build();
    }

    @GetMapping("/get-motel-image/{motelId}")
    public ApiResponse<List<MotelImageResponse>> getMotelImagesByMotelId(@PathVariable Long motelId) {
        return ApiResponse.<List<MotelImageResponse>>builder()
                .code(1000)
                .message("Get motel images successful")
                .data(motelImageService.findMotelImagesByMotelId(motelId))
                .build();
    }

    @GetMapping("/{imageId}")
    public ApiResponse<MotelImageResponse> getMotelImageById(@PathVariable Long imageId) {
        return ApiResponse.<MotelImageResponse>builder()
                .code(1000)
                .message("Get motel image successful")
                .data(motelImageService.findMotelImageById(imageId))
                .build();
    }

    @PutMapping("/update/{imageId}")
    public ApiResponse<MotelImageResponse> updateMotelImage(
            @PathVariable Long imageId, @RequestBody MotelImageUpdateRequest request) {
        return ApiResponse.<MotelImageResponse>builder()
                .code(1000)
                .message("Motel image updated successfully")
                .data(motelImageService.updateMotelImage(imageId, request))
                .build();
    }

    @DeleteMapping("/{imageId}")
    public ApiResponse<String> deleteMotelImage(@PathVariable Long imageId) {
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Motel image deleted successfully")
                .data(motelImageService.deleteMotelImage(imageId))
                .build();
    }
}
