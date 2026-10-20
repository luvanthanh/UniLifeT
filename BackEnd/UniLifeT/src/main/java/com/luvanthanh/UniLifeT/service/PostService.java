package com.luvanthanh.UniLifeT.service;

import com.luvanthanh.UniLifeT.dto.request.postRequest.PostCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.postRequest.PostUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.postResponse.PostResponse;
import com.luvanthanh.UniLifeT.entity.Post;
import com.luvanthanh.UniLifeT.entity.Room;
import com.luvanthanh.UniLifeT.entity.User;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.PostMapper;
import com.luvanthanh.UniLifeT.repository.PostRepository;
import com.luvanthanh.UniLifeT.repository.RoomRepository;
import com.luvanthanh.UniLifeT.repository.UserRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private PostMapper postMapper;

    public PostResponse createPost(PostCreationRequest request) {
        Post post = postMapper.toPost(request);
        post.setUser(findUser(request.getUserId()));
        post.setRoom(findRoom(request.getRoomId()));
        return postMapper.toPostResponse(postRepository.save(post));
    }

    public List<PostResponse> findAllPosts() {
        List<Post> posts = postRepository.findAll();
        List<PostResponse> postResponseList = new ArrayList<>();
        for (Post post : posts) {
            postResponseList.add(postMapper.toPostResponse(post));
        }
        return postResponseList;
    }

    public PostResponse findPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));
        return postMapper.toPostResponse(post);
    }

    public PostResponse updatePost(Long postId, PostUpdateRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));
        postMapper.toPostUpdate(post, request);
        if (request.getUserId() != null) {
            post.setUser(findUser(request.getUserId()));
        }
        if (request.getRoomId() != null) {
            post.setRoom(findRoom(request.getRoomId()));
        }
        return postMapper.toPostResponse(postRepository.save(post));
    }

    public String deletePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));
        postRepository.delete(post);
        return "Post Deleted Successfully";
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFIND));
    }

    private Room findRoom(Long roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
    }
}
