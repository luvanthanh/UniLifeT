package com.luvanthanh.UniLifeT.service;


import com.luvanthanh.UniLifeT.dto.request.universityRequest.UniversityCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.universityRequest.UniversityUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.universityResponse.UniversityResponse;
import com.luvanthanh.UniLifeT.entity.University;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.UniversityMapper;
import com.luvanthanh.UniLifeT.repository.UniversityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UniversityService {

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private UniversityMapper universityMapper;

    public UniversityResponse createUniversity(UniversityCreationRequest request) {
        University university = universityMapper.toUniversity(request);
        University createdUniversity = universityRepository.save(university);
        return universityMapper.toUniversityResponse(createdUniversity);
    }

    public List<UniversityResponse> findAllUniversities() {
        List<University> universities = universityRepository.findAll();
        List<UniversityResponse> universityResponseList = new ArrayList<>();
        for (University university : universities) {
            universityResponseList.add(universityMapper.toUniversityResponse(university));
        }
        return universityResponseList;
    }

    public UniversityResponse findUniversityById(Long id) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.UNIVERSITY_NOT_FOUND));
        return universityMapper.toUniversityResponse(university);
    }

    public UniversityResponse updateUniversity(Long universityId, UniversityUpdateRequest request) {
        University university = universityRepository.findById(universityId)
                .orElseThrow(() -> new AppException(ErrorCode.UNIVERSITY_NOT_FOUND));
        universityMapper.toUniversityUpdate(university, request);
        University updatedUniversity = universityRepository.save(university);
        return universityMapper.toUniversityResponse(updatedUniversity);
    }

    public String deleteUniversity(Long universityId) {
        University university = universityRepository.findById(universityId)
                .orElseThrow(() -> new AppException(ErrorCode.UNIVERSITY_NOT_FOUND));
        universityRepository.delete(university);
        return "University Deleted Successfully";
    }

}
