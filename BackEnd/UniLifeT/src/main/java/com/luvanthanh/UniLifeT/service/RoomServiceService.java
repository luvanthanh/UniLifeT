package com.luvanthanh.UniLifeT.service;

import com.luvanthanh.UniLifeT.dto.request.roomServiceRequest.RoomServiceCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.roomServiceRequest.RoomServiceUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.roomServiceResponse.RoomServiceResponse;
import com.luvanthanh.UniLifeT.entity.Room;
import com.luvanthanh.UniLifeT.entity.RoomService;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.RoomServiceMapper;
import com.luvanthanh.UniLifeT.repository.RoomRepository;
import com.luvanthanh.UniLifeT.repository.RoomServiceRepository;
import com.luvanthanh.UniLifeT.repository.ServiceRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomServiceService {

    @Autowired
    private RoomServiceRepository roomServiceRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private RoomServiceMapper roomServiceMapper;
// tạo mới
    public RoomServiceResponse createRoomService(RoomServiceCreationRequest request) {
        RoomService roomService = roomServiceMapper.toRoomService(request);
        roomService.setRoom(findRoom(request.getRoomId()));
        roomService.setService(findService(request.getServiceId()));
        return roomServiceMapper.toRoomServiceResponse(roomServiceRepository.save(roomService));
    }
// lấy tất
    public List<RoomServiceResponse> findAllRoomServices() {
        List<RoomServiceResponse> responses = new ArrayList<>();
        for (RoomService roomService : roomServiceRepository.findAll()) {
            responses.add(roomServiceMapper.toRoomServiceResponse(roomService));
        }
        return responses;
    }
//  lấy theo id
    public RoomServiceResponse findRoomServiceById(Long roomServiceId) {
        return roomServiceMapper.toRoomServiceResponse(findRoomService(roomServiceId));
    }

//    lấy theo room
    public List<RoomServiceResponse> findAllRoomServices(Long roomId) {
        List<RoomService> list = roomServiceRepository.findByRoom_RoomId(roomId);
        List<RoomServiceResponse> responses = new ArrayList<>();
        for (RoomService roomService : list) {
            RoomServiceResponse roomServiceResponse = roomServiceMapper.toRoomServiceResponse(roomService);
            responses.add(roomServiceResponse);
        }
        return  responses;
    }

//    cập nhật
    public RoomServiceResponse updateRoomService(Long roomServiceId, RoomServiceUpdateRequest request) {
        RoomService roomService = findRoomService(roomServiceId);
        roomServiceMapper.toRoomServiceUpdate(roomService, request);
        if (request.getRoomId() != null) {
            roomService.setRoom(findRoom(request.getRoomId()));
        }
        if (request.getServiceId() != null) {
            roomService.setService(findService(request.getServiceId()));
        }
        return roomServiceMapper.toRoomServiceResponse(roomServiceRepository.save(roomService));
    }
//  xóa
    public String deleteRoomService(Long roomServiceId) {
        RoomService roomService = findRoomService(roomServiceId);
        roomServiceRepository.delete(roomService);
        return "Room service deleted successfully";
    }

    private RoomService findRoomService(Long roomServiceId) {
        return roomServiceRepository.findById(roomServiceId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_SERVICE_NOT_FOUND));
    }

    private Room findRoom(Long roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
    }

    private com.luvanthanh.UniLifeT.entity.Service findService(Long serviceId) {
        return serviceRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
    }
}
