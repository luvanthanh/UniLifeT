package com.luvanthanh.UniLifeT.service;

import com.luvanthanh.UniLifeT.dto.request.roomRequest.RoomCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.roomRequest.RoomUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.roomResponse.RoomResponse;
import com.luvanthanh.UniLifeT.entity.Motel;
import com.luvanthanh.UniLifeT.entity.Room;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.RoomMapper;
import com.luvanthanh.UniLifeT.repository.MotelRepository;
import com.luvanthanh.UniLifeT.repository.RoomRepository;
import com.luvanthanh.UniLifeT.repository.ServiceRepository;
import com.luvanthanh.UniLifeT.repository.UserRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private MotelRepository motelRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomMapper roomMapper;
// tạo phòng mới
    public RoomResponse createRoom(RoomCreationRequest request) {
        Room room = roomMapper.toRoom(request);
        room.setMotel(motelRepository.findById(request.getMotelId())
                .orElseThrow(() -> new AppException(ErrorCode.MOTEL_NOT_FOUND)));
        room.setServices(findServices(request.getServiceIds()));
        return roomMapper.toRoomResponse(roomRepository.save(room));
    }
// lấy tất phòng
    public List<RoomResponse> findAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        List<RoomResponse> roomResponseList = new ArrayList<>();
        for (Room room : rooms) {
            roomResponseList.add(roomMapper.toRoomResponse(room));
        }
        return roomResponseList;
    }

    public List<RoomResponse> findOwnerRooms(String username) {
        var owner = userRepository.findByUserName(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFIND));
        return roomRepository.findByMotel_User_UserId(owner.getUserId()).stream()
                .map(roomMapper::toRoomResponse).toList();
    }

    public Page<RoomResponse> searchRooms(BigDecimal minPrice, BigDecimal maxPrice,
            Double minArea, Double maxArea, String status, String roomType,
            Long universityId, Long amenityId, Long serviceId, Pageable pageable) {
        if ((minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0)
                || (minArea != null && maxArea != null && minArea > maxArea)) {
            throw new AppException(ErrorCode.INVALID_ROOM_FILTER);
        }
        return roomRepository.searchRooms(minPrice, maxPrice, minArea, maxArea,
                status, roomType, universityId, amenityId, serviceId, pageable)
                .map(roomMapper::toRoomResponse);
    }
// lấy phòng theo id
    public RoomResponse findRoomById(Long roomId) {
        Room room = roomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        return roomMapper.toRoomResponse(room);
    }

//    lọc phòng theo giá tiền
    public List<RoomResponse> filterRomeByPrice (BigDecimal priceMin, BigDecimal priceMax) {
        List<RoomResponse> roomResponseList = new ArrayList<>();
        List<Room> rooms = roomRepository.findByRoomPriceBetween(priceMin,priceMax)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        for (Room room : rooms) {
            roomResponseList.add(roomMapper.toRoomResponse(room));

        }
        return roomResponseList;
    }

    //    lọc phòng theo diện tích
    public List<RoomResponse> filterRomeByRoomArea (double roomAreaMin, double roomAreaMax) {
        List<RoomResponse> roomResponseList = new ArrayList<>();
        List<Room> rooms = roomRepository.filterByArea(roomAreaMin,roomAreaMax)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        for (Room room : rooms) {
            roomResponseList.add(roomMapper.toRoomResponse(room));

        }
        return roomResponseList;
    }



    //  cập nhật phòng
    public RoomResponse updateRoom(Long roomId, RoomUpdateRequest request) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        roomMapper.toRoomUpdate(room, request);
        if (request.getMotelId() != null) {
            Motel motel = motelRepository.findById(request.getMotelId())
                    .orElseThrow(() -> new AppException(ErrorCode.MOTEL_NOT_FOUND));
            room.setMotel(motel);
        }
        if (request.getServiceIds() != null) {
            room.setServices(findServices(request.getServiceIds()));
        }
        return roomMapper.toRoomResponse(roomRepository.save(room));
    }

//    tăng số lượng view
    public RoomResponse updateRoomView(Long roomId) {
        Room room = roomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        room.setRoomView(room.getRoomView() + 1);
        return roomMapper.toRoomResponse(roomRepository.save(room));
    }
//  xóa phòng theo id
    public String deleteRoom(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        roomRepository.delete(room);
        return "Room Deleted Successfully";
    }

    private List<com.luvanthanh.UniLifeT.entity.Service> findServices(List<Long> serviceIds) {
        List<Long> ids = serviceIds == null
                ? List.of()
                : new ArrayList<>(new LinkedHashSet<>(serviceIds));
        List<com.luvanthanh.UniLifeT.entity.Service> services = serviceRepository.findAllById(ids);
        if (services.size() != ids.size()) {
            throw new AppException(ErrorCode.SERVICE_NOT_FOUND);
        }
        return services;
    }
}
