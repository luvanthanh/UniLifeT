package com.luvanthanh.UniLifeT.service;

import com.luvanthanh.UniLifeT.dto.request.roomAmenityRequest.RoomAmenityCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.roomAmenityRequest.RoomAmenityUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.roomAmenityResponse.RoomAmenityResponse;
import com.luvanthanh.UniLifeT.entity.Amenity;
import com.luvanthanh.UniLifeT.entity.Room;
import com.luvanthanh.UniLifeT.entity.RoomAmenity;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.RoomAmenityMapper;
import com.luvanthanh.UniLifeT.repository.AmenityRepository;
import com.luvanthanh.UniLifeT.repository.RoomAmenityRepository;
import com.luvanthanh.UniLifeT.repository.RoomRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomAmenityService {

    @Autowired
    private RoomAmenityRepository roomAmenityRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private AmenityRepository amenityRepository;

    @Autowired
    private RoomAmenityMapper roomAmenityMapper;

    public RoomAmenityResponse createRoomAmenity(RoomAmenityCreationRequest request) {
        RoomAmenity roomAmenity = roomAmenityMapper.toRoomAmenity(request);
        roomAmenity.setRoom(findRoom(request.getRoomId()));
        roomAmenity.setAmenity(findAmenity(request.getAmenityId()));
        if (request.getAmenityQuantity() == null) {
            roomAmenity.setAmenityQuantity(1);
        }
        return roomAmenityMapper.toRoomAmenityResponse(roomAmenityRepository.save(roomAmenity));
    }

    public List<RoomAmenityResponse> findAllRoomAmenities() {
        List<RoomAmenityResponse> responses = new ArrayList<>();
        for (RoomAmenity roomAmenity : roomAmenityRepository.findAll()) {
            responses.add(roomAmenityMapper.toRoomAmenityResponse(roomAmenity));
        }
        return responses;
    }

    public RoomAmenityResponse findRoomAmenityById(Long roomAmenityId) {
        return roomAmenityMapper.toRoomAmenityResponse(findRoomAmenity(roomAmenityId));
    }

    public List<RoomAmenityResponse> findAllRoomAmenities(Long roomId) {
        List<RoomAmenityResponse> responses = new ArrayList<>();
        for (RoomAmenity roomAmenity : roomAmenityRepository.findByRoom_RoomId(roomId)) {
            responses.add(roomAmenityMapper.toRoomAmenityResponse(roomAmenity));
        }
        return responses;
    }

    public RoomAmenityResponse updateRoomAmenity(Long roomAmenityId, RoomAmenityUpdateRequest request) {
        RoomAmenity roomAmenity = findRoomAmenity(roomAmenityId);
        roomAmenityMapper.toRoomAmenityUpdate(roomAmenity, request);
        if (request.getRoomId() != null) {
            roomAmenity.setRoom(findRoom(request.getRoomId()));
        }
        if (request.getAmenityId() != null) {
            roomAmenity.setAmenity(findAmenity(request.getAmenityId()));
        }
        return roomAmenityMapper.toRoomAmenityResponse(roomAmenityRepository.save(roomAmenity));
    }

    public String deleteRoomAmenity(Long roomAmenityId) {
        RoomAmenity roomAmenity = findRoomAmenity(roomAmenityId);
        roomAmenityRepository.delete(roomAmenity);
        return "Room amenity deleted successfully";
    }

    private RoomAmenity findRoomAmenity(Long roomAmenityId) {
        return roomAmenityRepository.findById(roomAmenityId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_AMENITY_NOT_FOUND));
    }

    private Room findRoom(Long roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
    }

    private Amenity findAmenity(Long amenityId) {
        return amenityRepository.findById(amenityId)
                .orElseThrow(() -> new AppException(ErrorCode.AMENITY_NOT_FOUND));
    }
}
