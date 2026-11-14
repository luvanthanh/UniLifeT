package com.luvanthanh.UniLifeT.controller;

import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.viewingAppointmentRequest.ViewingAppointmentCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.viewingAppointmentRequest.ViewingAppointmentStatusUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.viewingAppointmentResponse.ViewingAppointmentResponse;
import com.luvanthanh.UniLifeT.Enum.ViewingAppointmentStatus;
import com.luvanthanh.UniLifeT.service.ViewingAppointmentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/viewing-appointments")
public class ViewingAppointmentController {
    private final ViewingAppointmentService appointmentService;

    public ViewingAppointmentController(ViewingAppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<ViewingAppointmentResponse> create(
            Authentication authentication,
            @RequestBody ViewingAppointmentCreationRequest request
    ) {
        var result = appointmentService.create(authentication.getName(), request);
        return ApiResponse.<ViewingAppointmentResponse>builder()
                .code(1000).message("Viewing appointment requested").data(result).build();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<List<ViewingAppointmentResponse>> getMine(Authentication authentication) {
        var result = appointmentService.getStudentAppointments(authentication.getName());
        return ApiResponse.<List<ViewingAppointmentResponse>>builder()
                .code(1000).message("Get viewing appointments successful").data(result).build();
    }

    @GetMapping("/owner")
    @PreAuthorize("hasRole('OWNER')")
    public ApiResponse<List<ViewingAppointmentResponse>> getForOwner(Authentication authentication) {
        var result = appointmentService.getOwnerAppointments(authentication.getName());
        return ApiResponse.<List<ViewingAppointmentResponse>>builder()
                .code(1000).message("Get owner viewing appointments successful").data(result).build();
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<ViewingAppointmentResponse>> getAllForAdmin(
            @RequestParam(required = false) ViewingAppointmentStatus status) {
        var result = appointmentService.getAdminAppointments(status);
        return ApiResponse.<List<ViewingAppointmentResponse>>builder()
                .code(1000).message("Get all viewing appointments successful").data(result).build();
    }

    @GetMapping("/{appointmentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'OWNER')")
    public ApiResponse<ViewingAppointmentResponse> getById(
            Authentication authentication,
            @PathVariable Long appointmentId
    ) {
        var result = appointmentService.getById(authentication.getName(), appointmentId);
        return ApiResponse.<ViewingAppointmentResponse>builder()
                .code(1000).message("Get viewing appointment successful").data(result).build();
    }

    @PatchMapping("/{appointmentId}/status")
    @PreAuthorize("hasRole('OWNER')")
    public ApiResponse<ViewingAppointmentResponse> updateStatus(
            Authentication authentication,
            @PathVariable Long appointmentId,
            @RequestBody ViewingAppointmentStatusUpdateRequest request
    ) {
        var result = appointmentService.updateStatus(authentication.getName(), appointmentId, request);
        return ApiResponse.<ViewingAppointmentResponse>builder()
                .code(1000).message("Viewing appointment status updated").data(result).build();
    }

    @PatchMapping("/{appointmentId}/cancel")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<ViewingAppointmentResponse> cancel(
            Authentication authentication,
            @PathVariable Long appointmentId
    ) {
        var result = appointmentService.cancel(authentication.getName(), appointmentId);
        return ApiResponse.<ViewingAppointmentResponse>builder()
                .code(1000).message("Viewing appointment cancelled").data(result).build();
    }
}
