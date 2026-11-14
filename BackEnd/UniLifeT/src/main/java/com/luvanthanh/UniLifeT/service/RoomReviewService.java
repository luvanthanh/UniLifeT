package com.luvanthanh.UniLifeT.service;

import com.luvanthanh.UniLifeT.dto.request.roomReviewRequest.RoomReviewCreationRequest;
import com.luvanthanh.UniLifeT.dto.response.roomReviewResponse.RoomReviewResponse;
import com.luvanthanh.UniLifeT.entity.RoomReview;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.RoomReviewMapper;
import com.luvanthanh.UniLifeT.repository.RoomRepository;
import com.luvanthanh.UniLifeT.repository.RoomReviewRepository;
import com.luvanthanh.UniLifeT.repository.UserRepository;
import com.luvanthanh.UniLifeT.repository.UserRoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class RoomReviewService {
    private final RoomReviewRepository reviewRepository;
    private final UserRoomRepository userRoomRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final RoomReviewMapper reviewMapper;

    public RoomReviewService(
            RoomReviewRepository reviewRepository,
            UserRoomRepository userRoomRepository,
            RoomRepository roomRepository,
            UserRepository userRepository,
            RoomReviewMapper reviewMapper
    ) {
        this.reviewRepository = reviewRepository;
        this.userRoomRepository = userRoomRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.reviewMapper = reviewMapper;
    }

    @Transactional
    public RoomReviewResponse create(String username, RoomReviewCreationRequest request) {
        if (request == null || request.getUserRoomId() == null || request.getUserRoomId() <= 0
                || request.getRating() == null || request.getRating() < 1 || request.getRating() > 5
                || (request.getReviewContent() != null && request.getReviewContent().length() > 2000)) {
            throw new AppException(ErrorCode.INVALID_ROOM_REVIEW);
        }

        var user = userRepository.findByUserName(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFIND));
        var userRoom = userRoomRepository.findById(request.getUserRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_ROOM_NOT_FOUND));
        if (!userRoom.getUser().getUserId().equals(user.getUserId()) || !isCompleted(userRoom)) {
            throw new AppException(ErrorCode.INVALID_ROOM_REVIEW);
        }
        if (reviewRepository.existsByUserRoom_UserRoomId(userRoom.getUserRoomId())) {
            throw new AppException(ErrorCode.ROOM_REVIEW_ALREADY_EXISTS);
        }

        RoomReview review = new RoomReview();
        review.setUserRoom(userRoom);
        review.setRating(request.getRating().shortValue());
        review.setReviewContent(request.getReviewContent() == null ? null : request.getReviewContent().trim());
        return reviewMapper.toRoomReviewResponse(reviewRepository.save(review));
    }

    @Transactional(readOnly = true)
    public List<RoomReviewResponse> getForRoom(Long roomId) {
        if (!roomRepository.existsById(roomId)) {
            throw new AppException(ErrorCode.ROOM_NOT_FOUND);
        }
        return reviewRepository.findByUserRoom_Room_RoomIdOrderByCreatedAtDesc(roomId)
                .stream().map(reviewMapper::toRoomReviewResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<RoomReviewResponse> getMine(String username) {
        var user = userRepository.findByUserName(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFIND));
        return reviewRepository.findByUserRoom_User_UserIdOrderByCreatedAtDesc(user.getUserId())
                .stream().map(reviewMapper::toRoomReviewResponse).toList();
    }

    private boolean isCompleted(com.luvanthanh.UniLifeT.entity.UserRoom userRoom) {
        if (userRoom.getEndDate() != null && !userRoom.getEndDate().isAfter(LocalDate.now())) {
            return true;
        }
        String status = userRoom.getContractStatus();
        return status != null && (status.equalsIgnoreCase("COMPLETED") || status.equalsIgnoreCase("ENDED"));
    }
}
