package com.luvanthanh.UniLifeT.controller;

import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.roomServiceRequest.RoomServiceCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.roomServiceRequest.RoomServiceUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.roomServiceResponse.RoomServiceResponse;
import com.luvanthanh.UniLifeT.service.RoomServiceService;
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
@RequestMapping("/room-service")
public class RoomServiceController {
    @Autowired
    private RoomServiceService roomServiceService;

//    thêm mới
    @PostMapping
    public ApiResponse<RoomServiceResponse> createRoomService(@RequestBody RoomServiceCreationRequest request) {
        var result = roomServiceService.createRoomService(request);
        return ApiResponse.<RoomServiceResponse>builder()
                .code(1000)
                .message("Room service created successfully")
                .data(result)
                .build();
    }
//  câpj nhật id
    @PutMapping("/{roomServiceId}")
    public ApiResponse<RoomServiceResponse> updateRoomService(
            @PathVariable Long roomServiceId, @RequestBody RoomServiceUpdateRequest request) {
        var result = roomServiceService.updateRoomService(roomServiceId, request);
        return ApiResponse.<RoomServiceResponse>builder()
                .code(1000)
                .message("Room service updated successfully")
                .data(result)
                .build();
    }
// lấy tất
    @GetMapping
    public ApiResponse<List<RoomServiceResponse>> getAllRoomServices() {
        var result = roomServiceService.findAllRoomServices();
        return ApiResponse.<List<RoomServiceResponse>>builder()
                .code(1000)
                .message("Get all room services successful")
                .data(result)
                .build();
    }
// lấy theo id
    @GetMapping("/{roomServiceId}")
    public ApiResponse<RoomServiceResponse> getRoomServiceById(@PathVariable Long roomServiceId) {
        var result = roomServiceService.findRoomServiceById(roomServiceId);
        return ApiResponse.<RoomServiceResponse>builder()
                .code(1000)
                .message("Get room service successful")
                .data(result)
                .build();
    }
// lấy theo room
    @GetMapping("/get-room-service/{roomId}")
    public ApiResponse<List<RoomServiceResponse>> getRoomServiceByRoomId(@PathVariable Long roomId) {
        var result = roomServiceService.findAllRoomServices(roomId);
        return ApiResponse.<List<RoomServiceResponse>>builder()
                .code(1000)
                .message("Get all room services successful")
                .data(result)
                .build();
    }
    @DeleteMapping("/{roomServiceId}")
    public ApiResponse<String> deleteRoomService(@PathVariable Long roomServiceId) {
        var result = roomServiceService.deleteRoomService(roomServiceId);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Delete room service successful")
                .data(result)
                .build();
    }
}
