package com.luvanthanh.UniLifeT.service.image;

import com.luvanthanh.UniLifeT.dto.request.image.RoomImageCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.image.RoomImageUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.image.RoomImageResponse;
import com.luvanthanh.UniLifeT.entity.RoomImage;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.image.RoomImageMapper;
import com.luvanthanh.UniLifeT.repository.RoomRepository;
import com.luvanthanh.UniLifeT.repository.image.RoomImageRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomImageService {

    @Autowired
    private RoomImageRepository roomImageRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomImageMapper roomImageMapper;

    public RoomImageResponse createRoomImage(RoomImageCreationRequest request) {
        RoomImage roomImage = roomImageMapper.toRoomImage(request);
        roomImage.setRoom(roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND)));
        return roomImageMapper.toRoomImageResponse(roomImageRepository.save(roomImage));
    }

    public List<RoomImageResponse> findAllRoomImages() {
        List<RoomImageResponse> responses = new ArrayList<>();
        for (RoomImage roomImage : roomImageRepository.findAll()) {
            responses.add(roomImageMapper.toRoomImageResponse(roomImage));
        }
        return responses;
    }

    public RoomImageResponse findRoomImageById(Long imageId) {
        return roomImageMapper.toRoomImageResponse(findRoomImage(imageId));
    }

    public RoomImageResponse updateRoomImage(Long imageId, RoomImageUpdateRequest request) {
        RoomImage roomImage = findRoomImage(imageId);
        roomImageMapper.updateRoomImage(roomImage, request);
        if (request.getRoomId() != null) {
            roomImage.setRoom(roomRepository.findById(request.getRoomId())
                    .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND)));
        }
        return roomImageMapper.toRoomImageResponse(roomImageRepository.save(roomImage));
    }

    public String deleteRoomImage(Long imageId) {
        roomImageRepository.delete(findRoomImage(imageId));
        return "Room image deleted successfully";
    }

    private RoomImage findRoomImage(Long imageId) {
        return roomImageRepository.findById(imageId)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));
    }
}
