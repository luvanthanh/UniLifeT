package com.luvanthanh.UniLifeT.controller;


import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.userRequest.UserCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.userRequest.UserUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.userResponse.UserResponse;
import com.luvanthanh.UniLifeT.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

import static java.util.stream.DoubleStream.builder;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<UserResponse> getCurrentUser(Authentication authentication) {
        return ApiResponse.<UserResponse>builder().code(1000)
                .message("Get current user successful")
                .data(userService.findCurrentUser(authentication.getName())).build();
    }

    @PatchMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<UserResponse> updateCurrentUser(
            Authentication authentication, @RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder().code(1000)
                .message("Current user updated successfully")
                .data(userService.updateCurrentUser(authentication.getName(), request)).build();
    }

// cập nhật user
    @PutMapping("/{userId}")
    public ApiResponse<UserResponse>  updateUser (@PathVariable Long userId,  @RequestBody UserUpdateRequest request){
        var result = userService.updateUser(userId,request);

        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .message("User updated successfully")
                .data(result)
                .build();
    }

//    lấy all danh sách
    @GetMapping
    public ApiResponse<List<UserResponse>> getAllUsers (){
        var result = userService.findAllUsers();
        return ApiResponse.<List<UserResponse>>builder()
                .code(1000)
                .message("Get all user succesfull")
                .data(result)
                .build();
    }

//    lấy user theo id
    @GetMapping("/{userId}")
    public ApiResponse<UserResponse>  getUserByUserId(@PathVariable Long userId){
        var result = userService.findUserById(userId);
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .message("Get user successfull")
                .data(result)
                .build();
    }

//    xóa user
    @DeleteMapping("/{userId}")
    public ApiResponse<String>  deleteUser(@PathVariable Long userId){
        var result = userService.deleteUser(userId);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Delete user succesfull")
                .data(result)
                .build();
    }
}
