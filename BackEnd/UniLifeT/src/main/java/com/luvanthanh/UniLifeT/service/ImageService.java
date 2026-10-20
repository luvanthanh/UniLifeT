package com.luvanthanh.UniLifeT.service;


import com.luvanthanh.UniLifeT.dto.request.imageRequest.ImageCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.imageRequest.ImageUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.imageResponse.ImageResponse;
import com.luvanthanh.UniLifeT.entity.Image;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.ImageMapper;
import com.luvanthanh.UniLifeT.repository.ImageRepository;
import com.luvanthanh.UniLifeT.repository.MotelRepository;
import com.luvanthanh.UniLifeT.repository.PostRepository;
import com.luvanthanh.UniLifeT.repository.RoomRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private MotelRepository motelRepository;

    @Autowired
    private ImageMapper imageMapper;

    public ImageResponse createImage(ImageCreationRequest request) {
        Image image = imageMapper.toImage(request);
        image.setPost(request.getPostId() == null ? null : postRepository.findById(request.getPostId())
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND)));
        image.setRoom(request.getRoomId() == null ? null : roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND)));
        image.setMotel(request.getMotelId() == null ? null : motelRepository.findById(request.getMotelId())
                .orElseThrow(() -> new AppException(ErrorCode.MOTEL_NOT_FOUND)));
        return imageMapper.toImageResponse(imageRepository.save(image));
    }

    public List<ImageResponse> findAllImages() {
        List<Image> images = imageRepository.findAll();
        List<ImageResponse> imageResponseList = new ArrayList<>();
        for (Image image : images) {
            imageResponseList.add(imageMapper.toImageResponse(image));
        }
        return imageResponseList;
    }

    public ImageResponse findImageById(Long imageId) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));
        return imageMapper.toImageResponse(image);
    }

    public ImageResponse updateImage(Long imageId, ImageUpdateRequest request) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));
        imageMapper.toImageUpdate(image, request);
        if (request.getPostId() != null) {
            image.setPost(postRepository.findById(request.getPostId())
                    .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND)));
        }
        if (request.getRoomId() != null) {
            image.setRoom(roomRepository.findById(request.getRoomId())
                    .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND)));
        }
        if (request.getMotelId() != null) {
            image.setMotel(motelRepository.findById(request.getMotelId())
                    .orElseThrow(() -> new AppException(ErrorCode.MOTEL_NOT_FOUND)));
        }
        return imageMapper.toImageResponse(imageRepository.save(image));
    }

    public String deleteImage(Long imageId) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));
        imageRepository.delete(image);
        return "Image Deleted Successfully";
    }
}
