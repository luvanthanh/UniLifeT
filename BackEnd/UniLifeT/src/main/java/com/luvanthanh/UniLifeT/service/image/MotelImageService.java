package com.luvanthanh.UniLifeT.service.image;

import com.luvanthanh.UniLifeT.dto.request.image.MotelImageCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.image.MotelImageUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.image.MotelImageResponse;
import com.luvanthanh.UniLifeT.entity.MotelImage;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.image.MotelImageMapper;
import com.luvanthanh.UniLifeT.repository.MotelRepository;
import com.luvanthanh.UniLifeT.repository.image.MotelImageRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MotelImageService {

    @Autowired
    private MotelImageRepository motelImageRepository;

    @Autowired
    private MotelRepository motelRepository;

    @Autowired
    private MotelImageMapper motelImageMapper;

    public MotelImageResponse createMotelImage(MotelImageCreationRequest request) {
        MotelImage motelImage = motelImageMapper.toMotelImage(request);
        motelImage.setMotel(motelRepository.findById(request.getMotelId())
                .orElseThrow(() -> new AppException(ErrorCode.MOTEL_NOT_FOUND)));
        return motelImageMapper.toMotelImageResponse(motelImageRepository.save(motelImage));
    }

    public List<MotelImageResponse> findAllMotelImages() {
        List<MotelImageResponse> responses = new ArrayList<>();
        for (MotelImage motelImage : motelImageRepository.findAll()) {
            responses.add(motelImageMapper.toMotelImageResponse(motelImage));
        }
        return responses;
    }

    public MotelImageResponse findMotelImageById(Long imageId) {
        return motelImageMapper.toMotelImageResponse(findMotelImage(imageId));
    }

    public MotelImageResponse updateMotelImage(Long imageId, MotelImageUpdateRequest request) {
        MotelImage motelImage = findMotelImage(imageId);
        motelImageMapper.updateMotelImage(motelImage, request);
        if (request.getMotelId() != null) {
            motelImage.setMotel(motelRepository.findById(request.getMotelId())
                    .orElseThrow(() -> new AppException(ErrorCode.MOTEL_NOT_FOUND)));
        }
        return motelImageMapper.toMotelImageResponse(motelImageRepository.save(motelImage));
    }

    public String deleteMotelImage(Long imageId) {
        motelImageRepository.delete(findMotelImage(imageId));
        return "Motel image deleted successfully";
    }

    private MotelImage findMotelImage(Long imageId) {
        return motelImageRepository.findById(imageId)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));
    }
}
