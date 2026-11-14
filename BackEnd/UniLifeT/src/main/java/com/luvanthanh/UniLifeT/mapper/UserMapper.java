package com.luvanthanh.UniLifeT.mapper;
import com.luvanthanh.UniLifeT.dto.request.userRequest.UserCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.userRequest.UserUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.userResponse.UserResponse;
import com.luvanthanh.UniLifeT.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.BeanMapping;
import org.mapstruct.NullValuePropertyMappingStrategy;


@Mapper(componentModel = "Spring")
public interface UserMapper {
    User toUser (UserCreationRequest request);
    UserResponse toUserResponse (User user);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @org.mapstruct.Mapping(target = "userPassword", ignore = true)
    User toUserUpdate (@MappingTarget User user, UserUpdateRequest request);
}
