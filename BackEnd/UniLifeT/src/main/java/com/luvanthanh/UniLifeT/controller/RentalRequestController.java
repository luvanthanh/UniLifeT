package com.luvanthanh.UniLifeT.controller;

import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.rentalRequest.RentalRequestCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.rentalRequest.RentalRequestStatusUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.rentalRequest.RentalRequestResponse;
import com.luvanthanh.UniLifeT.service.RentalRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.luvanthanh.UniLifeT.Enum.RentalRequestStatus;

@RestController
@RequestMapping("/rental-requests")
public class RentalRequestController {
    @Autowired
    private RentalRequestService rentalRequestService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<RentalRequestResponse> createRentalRequest(
            Authentication authentication,
            @RequestBody RentalRequestCreationRequest request
    ) {
        var result = rentalRequestService.createRentalRequest(authentication.getName(), request);
        return ApiResponse.<RentalRequestResponse>builder()
                .code(1000)
                .message("Rental request created successfully")
                .data(result)
                .build();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<List<RentalRequestResponse>> getMyRentalRequests(Authentication authentication,
            @RequestParam(required = false) RentalRequestStatus status) {
        var result = rentalRequestService.getStudentRentalRequests(authentication.getName(), status);
        return ApiResponse.<List<RentalRequestResponse>>builder()
                .code(1000)
                .message("Get rental requests successful")
                .data(result)
                .build();
    }

    @GetMapping("/owner")
    @PreAuthorize("hasRole('OWNER')")
    public ApiResponse<List<RentalRequestResponse>> getOwnerRentalRequests(Authentication authentication,
            @RequestParam(required = false) RentalRequestStatus status) {
        var result = rentalRequestService.getOwnerRentalRequests(authentication.getName(), status);
        return ApiResponse.<List<RentalRequestResponse>>builder()
                .code(1000)
                .message("Get rental requests successful")
                .data(result)
                .build();
    }

    @GetMapping("/{rentalRequestId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'OWNER')")
    public ApiResponse<RentalRequestResponse> getRentalRequest(Authentication authentication,
            @PathVariable Long rentalRequestId) {
        String role = authentication.getAuthorities().stream().map(a -> a.getAuthority())
                .filter(a -> a.equals("ROLE_OWNER") || a.equals("ROLE_STUDENT"))
                .findFirst().orElse("");
        var result = rentalRequestService.getRentalRequest(authentication.getName(), rentalRequestId,
                role.equals("ROLE_OWNER"));
        return ApiResponse.<RentalRequestResponse>builder().code(1000)
                .message("Get rental request successful").data(result).build();
    }

    @PatchMapping("/{rentalRequestId}/status")
    @PreAuthorize("hasRole('OWNER')")
    public ApiResponse<RentalRequestResponse> updateRentalRequestStatus(
            Authentication authentication,
            @PathVariable Long rentalRequestId,
            @RequestBody RentalRequestStatusUpdateRequest request
    ) {
        var result = rentalRequestService.updateRentalRequestStatus(
                authentication.getName(), rentalRequestId, request.getStatus()
        );
        return ApiResponse.<RentalRequestResponse>builder()
                .code(1000)
                .message("Rental request status updated successfully")
                .data(result)
                .build();
    }

    @PatchMapping("/{rentalRequestId}/cancel")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<RentalRequestResponse> cancelRentalRequest(
            Authentication authentication,
            @PathVariable Long rentalRequestId
    ) {
        var result = rentalRequestService.cancelRentalRequest(authentication.getName(), rentalRequestId);
        return ApiResponse.<RentalRequestResponse>builder()
                .code(1000)
                .message("Rental request cancelled successfully")
                .data(result)
                .build();
    }
}
