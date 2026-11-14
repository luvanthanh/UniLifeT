package com.luvanthanh.UniLifeT.controller;

import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.roomFavoriteRequest.RoomFavoriteCreationRequest;
import com.luvanthanh.UniLifeT.dto.response.roomFavoriteResponse.RoomFavoriteResponse;
import com.luvanthanh.UniLifeT.service.RoomFavoriteService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/room-favorites")
public class RoomFavoriteController {
    private final RoomFavoriteService roomFavoriteService;

    public RoomFavoriteController(RoomFavoriteService roomFavoriteService) {
        this.roomFavoriteService = roomFavoriteService;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<RoomFavoriteResponse> addFavorite(
            Authentication authentication,
            @RequestBody RoomFavoriteCreationRequest request
    ) {
        var result = roomFavoriteService.addFavorite(authentication.getName(), request);
        return ApiResponse.<RoomFavoriteResponse>builder()
                .code(1000).message("Room added to favorites").data(result).build();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<List<RoomFavoriteResponse>> getMyFavorites(Authentication authentication) {
        var result = roomFavoriteService.getMyFavorites(authentication.getName());
        return ApiResponse.<List<RoomFavoriteResponse>>builder()
                .code(1000).message("Get favorite rooms successful").data(result).build();
    }

    @DeleteMapping("/{roomId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<Void> removeFavorite(Authentication authentication, @PathVariable Long roomId) {
        roomFavoriteService.removeFavorite(authentication.getName(), roomId);
        return ApiResponse.<Void>builder()
                .code(1000).message("Room removed from favorites").build();
    }
}
