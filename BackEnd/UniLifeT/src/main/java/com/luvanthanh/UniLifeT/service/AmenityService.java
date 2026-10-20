package com.luvanthanh.UniLifeT.service;


import com.luvanthanh.UniLifeT.dto.request.amenityRequest.AmenityCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.amenityRequest.AmenityUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.amenityResponse.AmenityResponse;
import com.luvanthanh.UniLifeT.entity.Amenity;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.AmenityMapper;
import com.luvanthanh.UniLifeT.repository.AmenityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AmenityService {

    @Autowired
    private AmenityRepository amenityRepository;

    @Autowired
    private AmenityMapper amenityMapper;

//    tạo mới tiện ích
    public AmenityResponse createAmenity(AmenityCreationRequest request) {
        Amenity amenity = amenityMapper.toAmenity(request);
        return amenityMapper.toAmenityResponse(amenityRepository.save(amenity));
    }
// lấy danh sách
    public List<AmenityResponse> findAllAmenities() {
        List<Amenity> amenities = amenityRepository.findAll();
        List<AmenityResponse> amenityResponseList = new ArrayList<>();
        for (Amenity amenity : amenities) {
            amenityResponseList.add(amenityMapper.toAmenityResponse(amenity));
        }
        return amenityResponseList;
    }
//
    public AmenityResponse findAmenityById(Long amenityId) {
        Amenity amenity = amenityRepository.findById(amenityId)
                .orElseThrow(() -> new AppException(ErrorCode.AMENITY_NOT_FOUND));
        return amenityMapper.toAmenityResponse(amenity);
    }

    public AmenityResponse updateAmenity(Long amenityId, AmenityUpdateRequest request) {
        Amenity amenity = amenityRepository.findById(amenityId)
                .orElseThrow(() -> new AppException(ErrorCode.AMENITY_NOT_FOUND));
        amenityMapper.toAmenityUpdate(amenity, request);
        return amenityMapper.toAmenityResponse(amenityRepository.save(amenity));
    }

    public String deleteAmenity(Long amenityId) {
        Amenity amenity = amenityRepository.findById(amenityId)
                .orElseThrow(() -> new AppException(ErrorCode.AMENITY_NOT_FOUND));
        amenityRepository.delete(amenity);
        return "Amenity Deleted Successfully";
    }
}
