package com.luvanthanh.UniLifeT.controller;

import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.userRoomRequest.UserRoomCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.userRoomRequest.UserRoomUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.userRoomResponse.UserRoomResponse;
import com.luvanthanh.UniLifeT.service.UserRomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user-room")
public class UserRomController {

    @Autowired
    private UserRomService userRomService;

    @PostMapping
    public ApiResponse<UserRoomResponse> createUserRoom(@RequestBody UserRoomCreationRequest request) {
        var result = userRomService.createUserRoom(request);
        return ApiResponse.<UserRoomResponse>builder()
                .code(1000)
                .message("User room created successfully")
                .data(result)
                .build();
    }

    @PutMapping("/update/{userRoomId}")
    public ApiResponse<UserRoomResponse> updateUserRoom(
            @PathVariable Long userRoomId, @RequestBody UserRoomUpdateRequest request) {
        var result = userRomService.updateUserRoom(userRoomId, request);
        return ApiResponse.<UserRoomResponse>builder()
                .code(1000)
                .message("User room updated successfully")
                .data(result)
                .build();
    }

    @GetMapping
    public ApiResponse<List<UserRoomResponse>> getAllUserRooms() {
        var result = userRomService.findAllUserRooms();
        return ApiResponse.<List<UserRoomResponse>>builder()
                .code(1000)
                .message("Get all user rooms successful")
                .data(result)
                .build();
    }

    @GetMapping("/{userRoomId}")
    public ApiResponse<UserRoomResponse> getUserRoomById(@PathVariable Long userRoomId) {
        var result = userRomService.findUserRoomById(userRoomId);
        return ApiResponse.<UserRoomResponse>builder()
                .code(1000)
                .message("Get user room successful")
                .data(result)
                .build();
    }

    @DeleteMapping("/{userRoomId}")
    public ApiResponse<String> deleteUserRoom(@PathVariable Long userRoomId) {
        var result = userRomService.deleteUserRoom(userRoomId);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Delete user room successful")
                .data(result)
                .build();
    }
}
