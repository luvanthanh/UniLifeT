package com.luvanthanh.UniLifeT.controller;

import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.roomReviewRequest.RoomReviewCreationRequest;
import com.luvanthanh.UniLifeT.dto.response.roomReviewResponse.RoomReviewResponse;
import com.luvanthanh.UniLifeT.service.RoomReviewService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/room-reviews")
public class RoomReviewController {
    private final RoomReviewService roomReviewService;

    public RoomReviewController(RoomReviewService roomReviewService) {
        this.roomReviewService = roomReviewService;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<RoomReviewResponse> create(
            Authentication authentication,
            @RequestBody RoomReviewCreationRequest request
    ) {
        var result = roomReviewService.create(authentication.getName(), request);
        return ApiResponse.<RoomReviewResponse>builder()
                .code(1000).message("Room review created successfully").data(result).build();
    }

    @GetMapping("/room/{roomId}")
    public ApiResponse<List<RoomReviewResponse>> getForRoom(@PathVariable Long roomId) {
        var result = roomReviewService.getForRoom(roomId);
        return ApiResponse.<List<RoomReviewResponse>>builder()
                .code(1000).message("Get room reviews successful").data(result).build();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<List<RoomReviewResponse>> getMine(Authentication authentication) {
        var result = roomReviewService.getMine(authentication.getName());
        return ApiResponse.<List<RoomReviewResponse>>builder()
                .code(1000).message("Get my room reviews successful").data(result).build();
    }
}
