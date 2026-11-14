package com.luvanthanh.UniLifeT.service;

import com.luvanthanh.UniLifeT.Enum.RentalRequestStatus;
import com.luvanthanh.UniLifeT.dto.request.rentalRequest.RentalRequestCreationRequest;
import com.luvanthanh.UniLifeT.dto.response.rentalRequest.RentalRequestResponse;
import com.luvanthanh.UniLifeT.entity.RentalRequest;
import com.luvanthanh.UniLifeT.entity.Room;
import com.luvanthanh.UniLifeT.entity.User;
import com.luvanthanh.UniLifeT.entity.UserRoom;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.RentalRequestMapper;
import com.luvanthanh.UniLifeT.repository.RentalRequestRepository;
import com.luvanthanh.UniLifeT.repository.RoomRepository;
import com.luvanthanh.UniLifeT.repository.UserRepository;
import com.luvanthanh.UniLifeT.repository.UserRoomRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

@Service
public class RentalRequestService {
    private final RentalRequestRepository rentalRequestRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final RentalRequestMapper rentalRequestMapper;
    private final UserRoomRepository userRoomRepository;

    public RentalRequestService(
            RentalRequestRepository rentalRequestRepository,
            RoomRepository roomRepository,
            UserRepository userRepository,
            RentalRequestMapper rentalRequestMapper,
            UserRoomRepository userRoomRepository
    ) {
        this.rentalRequestRepository = rentalRequestRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.rentalRequestMapper = rentalRequestMapper;
        this.userRoomRepository = userRoomRepository;
    }

    @Transactional
    public RentalRequestResponse createRentalRequest(String username, RentalRequestCreationRequest request) {
        if (request.getRoomId() == null || request.getRoomId() <= 0
                || request.getRequestedStartDate() == null
                || request.getRequestedStartDate().isBefore(LocalDate.now())) {
            throw new AppException(ErrorCode.INVALID_RENTAL_REQUEST);
        }
        if (request.getMessage() != null && request.getMessage().length() > 1000) {
            throw new AppException(ErrorCode.INVALID_RENTAL_REQUEST);
        }

        User student = findUser(username);
        Room room = roomRepository.findByIdForUpdate(request.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        if (!isAvailable(room.getRoomStatus())) {
            throw new AppException(ErrorCode.ROOM_NOT_AVAILABLE);
        }
        if (rentalRequestRepository.existsByStudent_UserIdAndRoom_RoomIdAndStatus(
                student.getUserId(), room.getRoomId(), RentalRequestStatus.PENDING
        )) {
            throw new AppException(ErrorCode.RENTAL_REQUEST_ALREADY_EXISTS);
        }

        RentalRequest rentalRequest = new RentalRequest();
        rentalRequest.setStudent(student);
        rentalRequest.setRoom(room);
        rentalRequest.setRequestedStartDate(request.getRequestedStartDate());
        rentalRequest.setRequestedRent(room.getRoomPrice());
        rentalRequest.setMessage(request.getMessage() == null ? null : request.getMessage().trim());
        rentalRequest.setStatus(RentalRequestStatus.PENDING);

        return rentalRequestMapper.toRentalRequestResponse(rentalRequestRepository.save(rentalRequest));
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public List<RentalRequestResponse> getStudentRentalRequests(String username) {
        User student = findUser(username);
        return rentalRequestRepository.findByStudent_UserIdOrderByCreatedAtDesc(student.getUserId())
                .stream()
                .map(rentalRequestMapper::toRentalRequestResponse)
                .toList();
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public RentalRequestResponse getRentalRequest(String username, Long id, boolean ownerAccess) {
        User user = findUser(username);
        RentalRequest request = findRentalRequest(id);
        boolean allowed = ownerAccess
                ? request.getRoom().getMotel().getUser().getUserId().equals(user.getUserId())
                : request.getStudent().getUserId().equals(user.getUserId());
        if (!allowed) throw new AppException(ErrorCode.UNAUTHORIZED);
        return rentalRequestMapper.toRentalRequestResponse(request);
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public List<RentalRequestResponse> getAdminRentalRequests(RentalRequestStatus status) {
        var requests = status == null
                ? rentalRequestRepository.findAllByOrderByCreatedAtDesc()
                : rentalRequestRepository.findByStatusOrderByCreatedAtDesc(status);
        return requests.stream().map(rentalRequestMapper::toRentalRequestResponse).toList();
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public RentalRequestResponse getAdminRentalRequest(Long id) {
        return rentalRequestMapper.toRentalRequestResponse(findRentalRequest(id));
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public List<RentalRequestResponse> getStudentRentalRequests(String username, RentalRequestStatus status) {
        User student = findUser(username);
        var requests = status == null
                ? rentalRequestRepository.findByStudent_UserIdOrderByCreatedAtDesc(student.getUserId())
                : rentalRequestRepository.findByStudent_UserIdAndStatusOrderByCreatedAtDesc(student.getUserId(), status);
        return requests.stream().map(rentalRequestMapper::toRentalRequestResponse).toList();
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public List<RentalRequestResponse> getOwnerRentalRequests(String username) {
        User owner = findUser(username);
        return rentalRequestRepository.findByRoom_Motel_User_UserIdOrderByCreatedAtDesc(owner.getUserId())
                .stream()
                .map(rentalRequestMapper::toRentalRequestResponse)
                .toList();
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public List<RentalRequestResponse> getOwnerRentalRequests(String username, RentalRequestStatus status) {
        User owner = findUser(username);
        var requests = status == null
                ? rentalRequestRepository.findByRoom_Motel_User_UserIdOrderByCreatedAtDesc(owner.getUserId())
                : rentalRequestRepository.findByRoom_Motel_User_UserIdAndStatusOrderByCreatedAtDesc(owner.getUserId(), status);
        return requests.stream().map(rentalRequestMapper::toRentalRequestResponse).toList();
    }

    @Transactional
    public RentalRequestResponse updateRentalRequestStatus(
            String username,
            Long rentalRequestId,
            String requestedStatus
    ) {
        RentalRequestStatus newStatus = parseOwnerStatus(requestedStatus);
        User owner = findUser(username);
        RentalRequest rentalRequest = findRentalRequest(rentalRequestId);
        Room room = roomRepository.findByIdForUpdate(rentalRequest.getRoom().getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        if (!room.getMotel().getUser().getUserId().equals(owner.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        if (rentalRequest.getStatus() != RentalRequestStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_RENTAL_REQUEST);
        }
        if (newStatus == RentalRequestStatus.ACCEPTED) {
            if (!isAvailable(room.getRoomStatus())) {
                throw new AppException(ErrorCode.ROOM_NOT_AVAILABLE);
            }
            room.setRoomStatus("RENTED");
            roomRepository.save(room);

            UserRoom userRoom = new UserRoom();
            userRoom.setUser(rentalRequest.getStudent());
            userRoom.setRoom(room);
            userRoom.setStartDate(rentalRequest.getRequestedStartDate());
            userRoom.setMonthlyRent(rentalRequest.getRequestedRent());
            userRoom.setContractStatus("ACTIVE");
            userRoomRepository.save(userRoom);

            rentalRequestRepository.findByRoom_RoomIdAndStatus(
                            room.getRoomId(), RentalRequestStatus.PENDING
                    ).stream()
                    .filter(other -> !other.getRentalRequestId().equals(rentalRequestId))
                    .forEach(other -> other.setStatus(RentalRequestStatus.REJECTED));
        }

        rentalRequest.setStatus(newStatus);
        return rentalRequestMapper.toRentalRequestResponse(rentalRequestRepository.save(rentalRequest));
    }

    @Transactional
    public RentalRequestResponse cancelRentalRequest(String username, Long rentalRequestId) {
        User student = findUser(username);
        RentalRequest rentalRequest = findRentalRequest(rentalRequestId);
        if (!rentalRequest.getStudent().getUserId().equals(student.getUserId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        if (rentalRequest.getStatus() != RentalRequestStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_RENTAL_REQUEST);
        }

        rentalRequest.setStatus(RentalRequestStatus.CANCELLED);
        return rentalRequestMapper.toRentalRequestResponse(rentalRequestRepository.save(rentalRequest));
    }

    private User findUser(String username) {
        return userRepository.findByUserName(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFIND));
    }

    private RentalRequest findRentalRequest(Long rentalRequestId) {
        return rentalRequestRepository.findById(rentalRequestId)
                .orElseThrow(() -> new AppException(ErrorCode.RENTAL_REQUEST_NOT_FOUND));
    }

    private RentalRequestStatus parseOwnerStatus(String status) {
        if (status == null) {
            throw new AppException(ErrorCode.INVALID_RENTAL_REQUEST);
        }
        try {
            RentalRequestStatus parsedStatus = RentalRequestStatus.valueOf(status.trim().toUpperCase(Locale.ROOT));
            if (parsedStatus != RentalRequestStatus.ACCEPTED && parsedStatus != RentalRequestStatus.REJECTED) {
                throw new AppException(ErrorCode.INVALID_RENTAL_REQUEST);
            }
            return parsedStatus;
        } catch (IllegalArgumentException exception) {
            throw new AppException(ErrorCode.INVALID_RENTAL_REQUEST);
        }
    }

    private boolean isAvailable(String status) {
        if (status == null) {
            return false;
        }
        String normalizedStatus = status.trim().toUpperCase(Locale.ROOT);
        return normalizedStatus.equals("AVAILABLE")
                || normalizedStatus.equals("OPEN")
                || normalizedStatus.equals("CÒN TRỐNG");
    }
}
