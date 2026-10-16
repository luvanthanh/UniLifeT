package com.luvanthanh.UniLifeT.controller;


import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.anthenticated.AuthenticationRequest;
import com.luvanthanh.UniLifeT.dto.request.anthenticated.IntrospectRequest;
import com.luvanthanh.UniLifeT.dto.request.anthenticated.LogoutRequest;
import com.luvanthanh.UniLifeT.dto.response.authenticatedResponse.AuthenticationResponse;
import com.luvanthanh.UniLifeT.dto.response.authenticatedResponse.IntrospectResponse;
import com.luvanthanh.UniLifeT.dto.response.authenticatedResponse.LogoutResponse;
import com.luvanthanh.UniLifeT.entity.Token;
import com.luvanthanh.UniLifeT.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/users/auth")
public class AuthenticationController {
    @Autowired
    AuthenticationService authenticationService;

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> login(@RequestBody AuthenticationRequest authenticationRequest){
        var result = authenticationService.authentication(authenticationRequest);
        return ApiResponse.<AuthenticationResponse>builder()
                .code(1000)
                .message("Login Successful")
                .data(result)
                .build();
    }

    @PostMapping("/logout")
    ApiResponse<Token> logout(@RequestBody LogoutRequest logoutRequest)
            throws JOSEException, ParseException{
        var result =  authenticationService.logout(logoutRequest);
        return ApiResponse.<LogoutResponse>builder()
                .code(1000)
                .message(" log out Success")
                .data(result)
                .build();
    }


    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request)
            throws JOSEException, ParseException
    {
        var result = authenticationService.introspect(request);

        return ApiResponse.<IntrospectResponse>builder()
                .code(1000)
                .message("IntrospectResponse ")
                .data(result)
                .build();
    }
}

