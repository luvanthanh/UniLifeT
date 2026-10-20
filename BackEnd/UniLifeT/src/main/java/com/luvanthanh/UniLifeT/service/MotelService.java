package com.luvanthanh.UniLifeT.service;


import com.luvanthanh.UniLifeT.dto.request.motelRequest.MotelCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.motelRequest.MotelUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.motelResponse.MotelResponse;
import com.luvanthanh.UniLifeT.entity.Motel;
import com.luvanthanh.UniLifeT.entity.University;
import com.luvanthanh.UniLifeT.entity.User;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.MotelMapper;
import com.luvanthanh.UniLifeT.repository.MotelRepository;
import com.luvanthanh.UniLifeT.repository.UniversityRepository;
import com.luvanthanh.UniLifeT.repository.UserRepository;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MotelService {

    @Autowired
    private MotelRepository motelRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private MotelMapper motelMapper;

    public MotelResponse createMotel(MotelCreationRequest request) {
        Motel motel = motelMapper.toMotel(request);
        motel.setUser(findUser(request.getUserId()));
        motel.setUniversities(findUniversities(request.getUniversityIds()));
        return motelMapper.toMotelResponse(motelRepository.save(motel));
    }

    public List<MotelResponse> findAllMotels() {
        List<Motel> motels = motelRepository.findAll();
        List<MotelResponse> motelResponseList = new ArrayList<>();
        for (Motel motel : motels) {
            motelResponseList.add(motelMapper.toMotelResponse(motel));
        }
        return motelResponseList;
    }

    public MotelResponse findMotelById(Long motelId) {
        Motel motel = motelRepository.findById(motelId)
                .orElseThrow(() -> new AppException(ErrorCode.MOTEL_NOT_FOUND));
        return motelMapper.toMotelResponse(motel);
    }

    public MotelResponse updateMotel(Long motelId, MotelUpdateRequest request) {
        Motel motel = motelRepository.findById(motelId)
                .orElseThrow(() -> new AppException(ErrorCode.MOTEL_NOT_FOUND));
        motelMapper.toMotelUpdate(motel, request);
        if (request.getUserId() != null) {
            motel.setUser(findUser(request.getUserId()));
        }
        if (request.getUniversityIds() != null) {
            motel.setUniversities(findUniversities(request.getUniversityIds()));
        }
        return motelMapper.toMotelResponse(motelRepository.save(motel));
    }

    public String deleteMotel(Long motelId) {
        Motel motel = motelRepository.findById(motelId)
                .orElseThrow(() -> new AppException(ErrorCode.MOTEL_NOT_FOUND));
        motelRepository.delete(motel);
        return "Motel Deleted Successfully";
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFIND));
    }

    private List<University> findUniversities(List<Long> universityIds) {
        List<Long> ids = universityIds == null
                ? List.of()
                : new ArrayList<>(new LinkedHashSet<>(universityIds));
        List<University> universities = universityRepository.findAllById(ids);
        if (universities.size() != ids.size()) {
            throw new AppException(ErrorCode.UNIVERSITY_NOT_FOUND);
        }
        return universities;
    }
}
