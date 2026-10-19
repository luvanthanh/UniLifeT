package com.luvanthanh.UniLifeT.controller;


import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.userRequest.UserCreationRequest;
import com.luvanthanh.UniLifeT.dto.response.userResponse.UserResponse;
import com.luvanthanh.UniLifeT.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static java.util.stream.DoubleStream.builder;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ApiResponse<UserResponse>  createUser (@RequestBody UserCreationRequest request){
        var result = userService.createUser(request);
        return ApiResponse.<UserResponse>builder()
                .code(200)
                .message("User created successfully")
                .data(result)
                .build();
    }

}
