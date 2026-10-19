package com.luvanthanh.UniLifeT.service;


import com.luvanthanh.UniLifeT.dto.request.userRequest.UserCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.userRequest.UserUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.userResponse.UserResponse;
import com.luvanthanh.UniLifeT.entity.User;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.UserMapper;
import com.luvanthanh.UniLifeT.reponsitory.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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


//    tạo mới user
    public UserResponse createUser (UserCreationRequest request){
        if(userRepository.existsByUsername(request.getUserName())){
            throw new AppException(ErrorCode.USER_EXITS);
        }
        User  user = userMapper.toUser(request);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10); // tạo passwordEncoder
        user.setUserPassword(passwordEncoder.encode(request.getUserPassword())); // set password cho user khi truyền request vào;
        return userMapper.toUserResponse(userRepository.save(user));
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
