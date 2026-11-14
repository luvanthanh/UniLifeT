package com.luvanthanh.UniLifeT.controller;

import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.userRoomRequest.UserRoomCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.userRoomRequest.UserRoomUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.userRoomResponse.UserRoomResponse;
import com.luvanthanh.UniLifeT.service.UserRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user-room")
public class UserRoomController {

    @Autowired
    private UserRoomService userRoomService;
// tạo mới userroom
    @PostMapping
    public ApiResponse<UserRoomResponse> createUserRoom(@RequestBody UserRoomCreationRequest request) {
        var result = userRoomService.createUserRoom(request);
        return ApiResponse.<UserRoomResponse>builder()
                .code(1000)
                .message("User room created successfully")
                .data(result)
                .build();
    }

//    sửa userroom
    @PutMapping("/{userRoomId}")
    public ApiResponse<UserRoomResponse> updateUserRoom(
            @PathVariable Long userRoomId, @RequestBody UserRoomUpdateRequest request) {
        var result = userRoomService.updateUserRoom(userRoomId, request);
        return ApiResponse.<UserRoomResponse>builder()
                .code(1000)
                .message("User room updated successfully")
                .data(result)
                .build();
    }
//lấy all userroom
    @GetMapping
    public ApiResponse<List<UserRoomResponse>> getAllUserRooms() {
        var result = userRoomService.findAllUserRooms();
        return ApiResponse.<List<UserRoomResponse>>builder()
                .code(1000)
                .message("Get all user rooms successful")
                .data(result)
                .build();
    }

//    lấy userroom theo id
    @GetMapping("/{userRoomId}")
    public ApiResponse<UserRoomResponse> getUserRoomById(@PathVariable Long userRoomId) {
        var result = userRoomService.findUserRoomById(userRoomId);
        return ApiResponse.<UserRoomResponse>builder()
                .code(1000)
                .message("Get user room successful")
                .data(result)
                .build();
    }

    //    lấy userroom theo id
    @GetMapping("/users/{userId}")
    public ApiResponse<List<UserRoomResponse>> getUserRoomByUserId(@PathVariable Long userId) {
        var result = userRoomService.getUserRoomByUserId(userId);
        return ApiResponse.<List<UserRoomResponse>>builder()
                .code(1000)
                .message("Get user room successful")
                .data(result)
                .build();
    }

//  xóa
    @DeleteMapping("/{userRoomId}")
    public ApiResponse<String> deleteUserRoom(@PathVariable Long userRoomId) {
        var result = userRoomService.deleteUserRoom(userRoomId);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Delete user room successful")
                .data(result)
                .build();
    }
}
