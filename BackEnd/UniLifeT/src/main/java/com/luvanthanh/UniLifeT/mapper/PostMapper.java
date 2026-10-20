package com.luvanthanh.UniLifeT.mapper;

import com.luvanthanh.UniLifeT.dto.request.postRequest.PostCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.postRequest.PostUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.postResponse.PostResponse;
import com.luvanthanh.UniLifeT.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "Spring")
public interface PostMapper {
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "images", ignore = true)
    Post toPost(PostCreationRequest request);

    @Mapping(target = "userId", source = "user.userId")
    @Mapping(target = "roomId", source = "room.roomId")
    PostResponse toPostResponse(Post post);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "images", ignore = true)
    Post toPostUpdate(@MappingTarget Post post, PostUpdateRequest request);
}
