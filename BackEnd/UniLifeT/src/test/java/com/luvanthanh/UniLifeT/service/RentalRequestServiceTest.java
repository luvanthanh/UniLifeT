package com.luvanthanh.UniLifeT.service;

import com.luvanthanh.UniLifeT.Enum.RentalRequestStatus;
import com.luvanthanh.UniLifeT.dto.request.rentalRequest.RentalRequestCreationRequest;
import com.luvanthanh.UniLifeT.dto.response.rentalRequest.RentalRequestResponse;
import com.luvanthanh.UniLifeT.entity.RentalRequest;
import com.luvanthanh.UniLifeT.entity.Motel;
import com.luvanthanh.UniLifeT.entity.Room;
import com.luvanthanh.UniLifeT.entity.User;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.mapper.RentalRequestMapper;
import com.luvanthanh.UniLifeT.repository.RentalRequestRepository;
import com.luvanthanh.UniLifeT.repository.RoomRepository;
import com.luvanthanh.UniLifeT.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RentalRequestServiceTest {
    @Mock
    private RentalRequestRepository rentalRequestRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RentalRequestMapper rentalRequestMapper;

    @InjectMocks
    private RentalRequestService rentalRequestService;

    @Test
    void createRentalRequestUsesAuthenticatedUserAndCurrentRoomPrice() {
        User student = new User();
        student.setUserId(12L);
        student.setUserName("student");
        Room room = new Room();
        room.setRoomId(34L);
        room.setRoomStatus("AVAILABLE");
        room.setRoomPrice(new BigDecimal("4500000"));

        RentalRequestCreationRequest request = new RentalRequestCreationRequest();
        request.setRoomId(34L);
        request.setRequestedStartDate(LocalDate.now().plusDays(1));
        request.setMessage("  Xin xem phòng  ");

        when(userRepository.findByUserName("student")).thenReturn(Optional.of(student));
        when(roomRepository.findByIdForUpdate(34L)).thenReturn(Optional.of(room));
        when(rentalRequestRepository.existsByStudent_UserIdAndRoom_RoomIdAndStatus(
                12L, 34L, RentalRequestStatus.PENDING
        )).thenReturn(false);
        when(rentalRequestRepository.save(any(RentalRequest.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(rentalRequestMapper.toRentalRequestResponse(any(RentalRequest.class)))
                .thenReturn(new RentalRequestResponse());

        rentalRequestService.createRentalRequest("student", request);

        ArgumentCaptor<RentalRequest> savedRequest = ArgumentCaptor.forClass(RentalRequest.class);
        verify(rentalRequestRepository).save(savedRequest.capture());
        assertSame(student, savedRequest.getValue().getStudent());
        assertSame(room, savedRequest.getValue().getRoom());
        assertEquals(new BigDecimal("4500000"), savedRequest.getValue().getRequestedRent());
        assertEquals("Xin xem phòng", savedRequest.getValue().getMessage());
        assertEquals(RentalRequestStatus.PENDING, savedRequest.getValue().getStatus());
    }

    @Test
    void createRentalRequestRejectsDuplicatePendingRequest() {
        User student = new User();
        student.setUserId(12L);
        Room room = new Room();
        room.setRoomId(34L);
        room.setRoomStatus("AVAILABLE");

        RentalRequestCreationRequest request = new RentalRequestCreationRequest();
        request.setRoomId(34L);
        request.setRequestedStartDate(LocalDate.now().plusDays(1));

        when(userRepository.findByUserName("student")).thenReturn(Optional.of(student));
        when(roomRepository.findByIdForUpdate(34L)).thenReturn(Optional.of(room));
        when(rentalRequestRepository.existsByStudent_UserIdAndRoom_RoomIdAndStatus(
                12L, 34L, RentalRequestStatus.PENDING
        )).thenReturn(true);

        assertThrows(AppException.class, () -> rentalRequestService.createRentalRequest("student", request));
        verify(rentalRequestRepository, never()).save(any(RentalRequest.class));
    }

    @Test
    void ownerCannotUpdateRequestForAnotherOwnersRoom() {
        User authenticatedOwner = new User();
        authenticatedOwner.setUserId(1L);
        User actualOwner = new User();
        actualOwner.setUserId(2L);
        Motel motel = new Motel();
        motel.setUser(actualOwner);
        Room room = new Room();
        room.setRoomId(34L);
        room.setMotel(motel);

        RentalRequest rentalRequest = new RentalRequest();
        rentalRequest.setRentalRequestId(56L);
        rentalRequest.setRoom(room);
        rentalRequest.setStatus(RentalRequestStatus.PENDING);

        when(userRepository.findByUserName("owner")).thenReturn(Optional.of(authenticatedOwner));
        when(rentalRequestRepository.findById(56L)).thenReturn(Optional.of(rentalRequest));
        when(roomRepository.findByIdForUpdate(34L)).thenReturn(Optional.of(room));

        assertThrows(
                AppException.class,
                () -> rentalRequestService.updateRentalRequestStatus("owner", 56L, "ACCEPTED")
        );
        verify(rentalRequestRepository, never()).save(any(RentalRequest.class));
        verify(roomRepository, never()).save(any(Room.class));
    }
}
