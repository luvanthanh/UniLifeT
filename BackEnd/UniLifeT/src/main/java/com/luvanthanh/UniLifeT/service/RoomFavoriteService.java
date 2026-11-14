package com.luvanthanh.UniLifeT.service;

import com.luvanthanh.UniLifeT.dto.request.roomFavoriteRequest.RoomFavoriteCreationRequest;
import com.luvanthanh.UniLifeT.dto.response.roomFavoriteResponse.RoomFavoriteResponse;
import com.luvanthanh.UniLifeT.entity.RoomFavorite;
import com.luvanthanh.UniLifeT.entity.RoomFavoriteId;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.RoomFavoriteMapper;
import com.luvanthanh.UniLifeT.repository.RoomFavoriteRepository;
import com.luvanthanh.UniLifeT.repository.RoomRepository;
import com.luvanthanh.UniLifeT.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RoomFavoriteService {
    private final RoomFavoriteRepository roomFavoriteRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final RoomFavoriteMapper roomFavoriteMapper;

    public RoomFavoriteService(
            RoomFavoriteRepository roomFavoriteRepository,
            RoomRepository roomRepository,
            UserRepository userRepository,
            RoomFavoriteMapper roomFavoriteMapper
    ) {
        this.roomFavoriteRepository = roomFavoriteRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.roomFavoriteMapper = roomFavoriteMapper;
    }

    @Transactional
    public RoomFavoriteResponse addFavorite(String username, RoomFavoriteCreationRequest request) {
        if (request == null || request.getRoomId() == null || request.getRoomId() <= 0) {
            throw new AppException(ErrorCode.ROOM_NOT_FOUND);
        }

        var user = userRepository.findByUserName(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFIND));
        var room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        if (roomFavoriteRepository.existsByUser_UserIdAndRoom_RoomId(user.getUserId(), room.getRoomId())) {
            throw new AppException(ErrorCode.ROOM_FAVORITE_ALREADY_EXISTS);
        }

        RoomFavorite favorite = new RoomFavorite();
        favorite.setId(new RoomFavoriteId(user.getUserId(), room.getRoomId()));
        favorite.setUser(user);
        favorite.setRoom(room);
        favorite.setCreatedAt(LocalDateTime.now());
        return roomFavoriteMapper.toRoomFavoriteResponse(roomFavoriteRepository.save(favorite));
    }

    @Transactional(readOnly = true)
    public List<RoomFavoriteResponse> getMyFavorites(String username) {
        var user = userRepository.findByUserName(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFIND));
        return roomFavoriteRepository.findByUser_UserIdOrderByCreatedAtDesc(user.getUserId())
                .stream()
                .map(roomFavoriteMapper::toRoomFavoriteResponse)
                .toList();
    }

    @Transactional
    public void removeFavorite(String username, Long roomId) {
        var user = userRepository.findByUserName(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFIND));
        if (!roomFavoriteRepository.existsByUser_UserIdAndRoom_RoomId(user.getUserId(), roomId)) {
            throw new AppException(ErrorCode.ROOM_FAVORITE_NOT_FOUND);
        }
        roomFavoriteRepository.deleteByUser_UserIdAndRoom_RoomId(user.getUserId(), roomId);
    }
}
