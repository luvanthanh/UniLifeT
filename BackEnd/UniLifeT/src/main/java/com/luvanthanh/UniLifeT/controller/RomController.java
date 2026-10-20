package com.luvanthanh.UniLifeT.controller;

import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.roomRequest.RoomCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.roomRequest.RoomUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.motelResponse.MotelResponse;
import com.luvanthanh.UniLifeT.dto.response.roomResponse.RoomResponse;
import com.luvanthanh.UniLifeT.entity.Room;
import com.luvanthanh.UniLifeT.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roms")
public class RomController {

    @Autowired
    private RoomService roomService;

// tạo phòng mới
    @PostMapping
    public ApiResponse<RoomResponse> createRoom(@RequestBody RoomCreationRequest request) {
        var result = roomService.createRoom(request);
        return ApiResponse.<RoomResponse>builder()
                .code(1000)
                .message("Room created successfully")
                .data(result)
                .build();
    }

    @PutMapping("/update/{roomId}")
    public ApiResponse<RoomResponse> updateRoom(
            @PathVariable Long roomId, @RequestBody RoomUpdateRequest request) {
        var result = roomService.updateRoom(roomId, request);
        return ApiResponse.<RoomResponse>builder()
                .code(1000)
                .message("Room updated successfully")
                .data(result)
                .build();
    }

//     lấy all phòng
    @GetMapping
    public ApiResponse<List<RoomResponse>> getAllRooms() {
        var result = roomService.findAllRooms();
        return ApiResponse.<List<RoomResponse>>builder()
                .code(1000)
                .message("Get all rooms successful")
                .data(result)
                .build();
    }

//    lấy phòng theo id
    @GetMapping("/{roomId}")
    public ApiResponse<RoomResponse> getRoomById(@PathVariable Long roomId) {
        var result = roomService.findRoomById(roomId);
        return ApiResponse.<RoomResponse>builder()
                .code(1000)
                .message("Get room successful")
                .data(result)
                .build();
    }

    @GetMapping("/motels/{motelId}")
    public ApiResponse<List<MotelResponse>> getMotelsByMotelId(@PathVariable Long motelId) {
        var
    }
//  xóa phòng theo id
    @DeleteMapping("/{roomId}")
    public ApiResponse<String> deleteRoom(@PathVariable Long roomId) {
        var result = roomService.deleteRoom(roomId);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Delete room successful")
                .data(result)
                .build();
    }

}
