package com.luvanthanh.UniLifeT.service;

import com.luvanthanh.UniLifeT.Enum.ViewingAppointmentStatus;
import com.luvanthanh.UniLifeT.dto.request.viewingAppointmentRequest.ViewingAppointmentCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.viewingAppointmentRequest.ViewingAppointmentStatusUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.viewingAppointmentResponse.ViewingAppointmentResponse;
import com.luvanthanh.UniLifeT.entity.ViewingAppointment;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.ViewingAppointmentMapper;
import com.luvanthanh.UniLifeT.repository.RoomRepository;
import com.luvanthanh.UniLifeT.repository.UserRepository;
import com.luvanthanh.UniLifeT.repository.ViewingAppointmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
public class ViewingAppointmentService {
    private final ViewingAppointmentRepository appointmentRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final ViewingAppointmentMapper appointmentMapper;

    public ViewingAppointmentService(
            ViewingAppointmentRepository appointmentRepository,
            RoomRepository roomRepository,
            UserRepository userRepository,
            ViewingAppointmentMapper appointmentMapper
    ) {
        this.appointmentRepository = appointmentRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.appointmentMapper = appointmentMapper;
    }

    @Transactional
    public ViewingAppointmentResponse create(String username, ViewingAppointmentCreationRequest request) {
        if (request == null || request.getRoomId() == null || request.getRoomId() <= 0
                || request.getRequestedAt() == null
                || !request.getRequestedAt().isAfter(LocalDateTime.now())
                || (request.getMessage() != null && request.getMessage().length() > 1000)) {
            throw new AppException(ErrorCode.INVALID_VIEWING_APPOINTMENT);
        }

        var student = findUser(username);
        var room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        if (!isAvailable(room.getRoomStatus())) {
            throw new AppException(ErrorCode.ROOM_NOT_AVAILABLE);
        }

        ViewingAppointment appointment = new ViewingAppointment();
        appointment.setStudent(student);
        appointment.setRoom(room);
        appointment.setRequestedAt(request.getRequestedAt());
        appointment.setMessage(request.getMessage() == null ? null : request.getMessage().trim());
        appointment.setStatus(ViewingAppointmentStatus.PENDING);
        return appointmentMapper.toViewingAppointmentResponse(appointmentRepository.save(appointment));
    }

    @Transactional(readOnly = true)
    public List<ViewingAppointmentResponse> getStudentAppointments(String username) {
        var student = findUser(username);
        return appointmentRepository.findByStudent_UserIdOrderByCreatedAtDesc(student.getUserId())
                .stream().map(appointmentMapper::toViewingAppointmentResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ViewingAppointmentResponse> getOwnerAppointments(String username) {
        var owner = findUser(username);
        return appointmentRepository.findByRoom_Motel_User_UserIdOrderByCreatedAtDesc(owner.getUserId())
                .stream().map(appointmentMapper::toViewingAppointmentResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ViewingAppointmentResponse> getAdminAppointments(ViewingAppointmentStatus status) {
        var appointments = status == null
                ? appointmentRepository.findAllByOrderByCreatedAtDesc()
                : appointmentRepository.findByStatusOrderByCreatedAtDesc(status);
        return appointments.stream().map(appointmentMapper::toViewingAppointmentResponse).toList();
    }

    @Transactional(readOnly = true)
    public ViewingAppointmentResponse getById(String username, Long appointmentId) {
        var user = findUser(username);
        ViewingAppointment appointment = findAppointment(appointmentId);
        if (!isStudentOf(appointment, user.getUserId()) && !isOwnerOf(appointment, user.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return appointmentMapper.toViewingAppointmentResponse(appointment);
    }

    @Transactional
    public ViewingAppointmentResponse updateStatus(
            String username,
            Long appointmentId,
            ViewingAppointmentStatusUpdateRequest request
    ) {
        if (request == null || request.getStatus() == null) {
            throw new AppException(ErrorCode.INVALID_VIEWING_APPOINTMENT);
        }
        ViewingAppointmentStatus next;
        try {
            next = ViewingAppointmentStatus.valueOf(request.getStatus().trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new AppException(ErrorCode.INVALID_VIEWING_APPOINTMENT);
        }
        var owner = findUser(username);
        ViewingAppointment appointment = findAppointment(appointmentId);
        if (!isOwnerOf(appointment, owner.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (appointment.getStatus() == ViewingAppointmentStatus.PENDING) {
            if (next == ViewingAppointmentStatus.CONFIRMED) {
                if (request.getScheduledAt() == null || !request.getScheduledAt().isAfter(LocalDateTime.now())) {
                    throw new AppException(ErrorCode.INVALID_VIEWING_APPOINTMENT);
                }
                appointment.setScheduledAt(request.getScheduledAt());
            } else if (next != ViewingAppointmentStatus.REJECTED) {
                throw new AppException(ErrorCode.INVALID_VIEWING_APPOINTMENT);
            }
        } else if (appointment.getStatus() == ViewingAppointmentStatus.CONFIRMED) {
            if (next != ViewingAppointmentStatus.COMPLETED) {
                throw new AppException(ErrorCode.INVALID_VIEWING_APPOINTMENT);
            }
        } else {
            throw new AppException(ErrorCode.INVALID_VIEWING_APPOINTMENT);
        }

        appointment.setStatus(next);
        return appointmentMapper.toViewingAppointmentResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public ViewingAppointmentResponse cancel(String username, Long appointmentId) {
        var student = findUser(username);
        ViewingAppointment appointment = findAppointment(appointmentId);
        if (!isStudentOf(appointment, student.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        if (appointment.getStatus() != ViewingAppointmentStatus.PENDING
                && appointment.getStatus() != ViewingAppointmentStatus.CONFIRMED) {
            throw new AppException(ErrorCode.INVALID_VIEWING_APPOINTMENT);
        }
        appointment.setStatus(ViewingAppointmentStatus.CANCELLED);
        return appointmentMapper.toViewingAppointmentResponse(appointmentRepository.save(appointment));
    }

    private com.luvanthanh.UniLifeT.entity.User findUser(String username) {
        return userRepository.findByUserName(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFIND));
    }

    private ViewingAppointment findAppointment(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VIEWING_APPOINTMENT_NOT_FOUND));
    }

    private boolean isStudentOf(ViewingAppointment appointment, Long userId) {
        return appointment.getStudent().getUserId().equals(userId);
    }

    private boolean isOwnerOf(ViewingAppointment appointment, Long userId) {
        return appointment.getRoom().getMotel().getUser().getUserId().equals(userId);
    }

    private boolean isAvailable(String status) {
        if (status == null) {
            return false;
        }
        String normalized = status.trim().toUpperCase(Locale.ROOT);
        return normalized.equals("AVAILABLE") || normalized.equals("OPEN") || normalized.equals("CÒN TRỐNG");
    }
}
