package com.luvanthanh.UniLifeT.controller.image;

import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.image.RoomImageCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.image.RoomImageUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.image.RoomImageResponse;
import com.luvanthanh.UniLifeT.service.image.RoomImageService;
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
@RequestMapping("/room-images")
public class RoomImageController {

    @Autowired
    private RoomImageService roomImageService;

    @PostMapping
    public ApiResponse<RoomImageResponse> createRoomImage(@RequestBody RoomImageCreationRequest request) {
        return ApiResponse.<RoomImageResponse>builder()
                .code(1000)
                .message("Room image created successfully")
                .data(roomImageService.createRoomImage(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<RoomImageResponse>> getAllRoomImages() {
        return ApiResponse.<List<RoomImageResponse>>builder()
                .code(1000)
                .message("Get all room images successful")
                .data(roomImageService.findAllRoomImages())
                .build();
    }

    @GetMapping("/{imageId}")
    public ApiResponse<RoomImageResponse> getRoomImageById(@PathVariable Long imageId) {
        return ApiResponse.<RoomImageResponse>builder()
                .code(1000)
                .message("Get room image successful")
                .data(roomImageService.findRoomImageById(imageId))
                .build();
    }

    @PutMapping("/update/{imageId}")
    public ApiResponse<RoomImageResponse> updateRoomImage(
            @PathVariable Long imageId, @RequestBody RoomImageUpdateRequest request) {
        return ApiResponse.<RoomImageResponse>builder()
                .code(1000)
                .message("Room image updated successfully")
                .data(roomImageService.updateRoomImage(imageId, request))
                .build();
    }

    @DeleteMapping("/{imageId}")
    public ApiResponse<String> deleteRoomImage(@PathVariable Long imageId) {
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Room image deleted successfully")
                .data(roomImageService.deleteRoomImage(imageId))
                .build();
    }
}
