package com.luvanthanh.UniLifeT.service;

import com.luvanthanh.UniLifeT.dto.request.userRoomRequest.UserRoomCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.userRoomRequest.UserRoomUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.userRoomResponse.UserRoomResponse;
import com.luvanthanh.UniLifeT.entity.Room;
import com.luvanthanh.UniLifeT.entity.User;
import com.luvanthanh.UniLifeT.entity.UserRoom;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.UserRoomMapper;
import com.luvanthanh.UniLifeT.repository.RoomRepository;
import com.luvanthanh.UniLifeT.repository.UserRepository;
import com.luvanthanh.UniLifeT.repository.UserRoomRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserRomService {

    @Autowired
    private UserRoomRepository userRoomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRoomMapper userRoomMapper;

    public UserRoomResponse createUserRoom(UserRoomCreationRequest request) {
        UserRoom userRoom = userRoomMapper.toUserRoom(request);
        userRoom.setUser(findUser(request.getUserId()));
        userRoom.setRoom(findRoom(request.getRoomId()));
        return userRoomMapper.toUserRoomResponse(userRoomRepository.save(userRoom));
    }

    public List<UserRoomResponse> findAllUserRooms() {
        List<UserRoom> userRooms = userRoomRepository.findAll();
        List<UserRoomResponse> userRoomResponseList = new ArrayList<>();
        for (UserRoom userRoom : userRooms) {
            userRoomResponseList.add(userRoomMapper.toUserRoomResponse(userRoom));
        }
        return userRoomResponseList;
    }

    public UserRoomResponse findUserRoomById(Long userRoomId) {
        UserRoom userRoom = userRoomRepository.findById(userRoomId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_ROOM_NOT_FOUND));
        return userRoomMapper.toUserRoomResponse(userRoom);
    }

    public UserRoomResponse updateUserRoom(Long userRoomId, UserRoomUpdateRequest request) {
        UserRoom userRoom = userRoomRepository.findById(userRoomId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_ROOM_NOT_FOUND));
        userRoomMapper.toUserRoomUpdate(userRoom, request);
        if (request.getUserId() != null) {
            userRoom.setUser(findUser(request.getUserId()));
        }
        if (request.getRoomId() != null) {
            userRoom.setRoom(findRoom(request.getRoomId()));
        }
        return userRoomMapper.toUserRoomResponse(userRoomRepository.save(userRoom));
    }

    public String deleteUserRoom(Long userRoomId) {
        UserRoom userRoom = userRoomRepository.findById(userRoomId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_ROOM_NOT_FOUND));
        userRoomRepository.delete(userRoom);
        return "User Room Deleted Successfully";
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFIND));
    }

    private Room findRoom(Long roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
    }
}
