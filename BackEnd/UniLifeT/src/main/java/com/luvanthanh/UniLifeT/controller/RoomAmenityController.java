package com.luvanthanh.UniLifeT.controller;

import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.roomAmenityRequest.RoomAmenityCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.roomAmenityRequest.RoomAmenityUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.roomAmenityResponse.RoomAmenityResponse;
import com.luvanthanh.UniLifeT.service.RoomAmenityService;
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
@RequestMapping("/room-amenity")
public class RoomAmenityController {

    @Autowired
    private RoomAmenityService roomAmenityService;

    @PostMapping
    public ApiResponse<RoomAmenityResponse> createRoomAmenity(@RequestBody RoomAmenityCreationRequest request) {
        var result = roomAmenityService.createRoomAmenity(request);
        return ApiResponse.<RoomAmenityResponse>builder()
                .code(1000)
                .message("Room amenity created successfully")
                .data(result)
                .build();
    }

    @PutMapping("/update/{roomAmenityId}")
    public ApiResponse<RoomAmenityResponse> updateRoomAmenity(
            @PathVariable Long roomAmenityId, @RequestBody RoomAmenityUpdateRequest request) {
        var result = roomAmenityService.updateRoomAmenity(roomAmenityId, request);
        return ApiResponse.<RoomAmenityResponse>builder()
                .code(1000)
                .message("Room amenity updated successfully")
                .data(result)
                .build();
    }

    @GetMapping
    public ApiResponse<List<RoomAmenityResponse>> getAllRoomAmenities() {
        var result = roomAmenityService.findAllRoomAmenities();
        return ApiResponse.<List<RoomAmenityResponse>>builder()
                .code(1000)
                .message("Get all room amenities successful")
                .data(result)
                .build();
    }

    @GetMapping("/{roomAmenityId}")
    public ApiResponse<RoomAmenityResponse> getRoomAmenityById(@PathVariable Long roomAmenityId) {
        var result = roomAmenityService.findRoomAmenityById(roomAmenityId);
        return ApiResponse.<RoomAmenityResponse>builder()
                .code(1000)
                .message("Get room amenity successful")
                .data(result)
                .build();
    }

    @DeleteMapping("/{roomAmenityId}")
    public ApiResponse<String> deleteRoomAmenity(@PathVariable Long roomAmenityId) {
        var result = roomAmenityService.deleteRoomAmenity(roomAmenityId);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Delete room amenity successful")
                .data(result)
                .build();
    }
}
