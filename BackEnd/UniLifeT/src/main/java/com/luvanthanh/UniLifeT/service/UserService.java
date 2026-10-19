package com.luvanthanh.UniLifeT.service;

import com.luvanthanh.UniLifeT.dto.request.userRequest.UserUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.userResponse.UserResponse;
import com.luvanthanh.UniLifeT.entity.User;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.UserMapper;
import com.luvanthanh.UniLifeT.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    UserMapper userMapper;


//    lấy danh sách user
    public List<UserResponse> findAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserResponse> userResponseList = new ArrayList<>();
        for(User user : users){
            UserResponse userResponse = userMapper.toUserResponse(user);
            userResponseList.add(userResponse);
        }
        return userResponseList;
    }
//    lấy user theo id
    public UserResponse findUserById(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(()-> new AppException(ErrorCode.USER_NOTFIND));

      return userMapper.toUserResponse(user);
    }

//    lấy user theo tên
    public UserResponse findUserByName(String name){
        User user = userRepository.findByUserName(name)
                .orElseThrow(()-> new AppException(ErrorCode.USER_NOTFIND));
        return userMapper.toUserResponse(user);
    }


//    sửa user
    public UserResponse updateUser(Long userId, UserUpdateRequest request) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFIND));
        userMapper.toUserUpdate(user,request);
        User updatedUser = userRepository.save(user);

        return userMapper.toUserResponse(updatedUser);
    }

//    xóa user
    public String deleteUser(Long userId){
        userRepository.deleteUserByUserId(userId);
        return "User Deleted Successfully";
    }
}
