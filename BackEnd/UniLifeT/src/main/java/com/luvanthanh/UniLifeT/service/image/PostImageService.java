package com.luvanthanh.UniLifeT.service.image;

import com.luvanthanh.UniLifeT.dto.request.image.PostImageCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.image.PostImageUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.image.PostImageResponse;
import com.luvanthanh.UniLifeT.entity.PostImage;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.mapper.image.PostImageMapper;
import com.luvanthanh.UniLifeT.repository.PostRepository;
import com.luvanthanh.UniLifeT.repository.image.PostImageRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostImageService {

    @Autowired
    private PostImageRepository postImageRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostImageMapper postImageMapper;

    public PostImageResponse createPostImage(PostImageCreationRequest request) {
        PostImage postImage = postImageMapper.toPostImage(request);
        postImage.setPost(postRepository.findById(request.getPostId())
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND)));
        return postImageMapper.toPostImageResponse(postImageRepository.save(postImage));
    }

    public List<PostImageResponse> findAllPostImages() {
        List<PostImageResponse> responses = new ArrayList<>();
        for (PostImage postImage : postImageRepository.findAll()) {
            responses.add(postImageMapper.toPostImageResponse(postImage));
        }
        return responses;
    }

    public List<PostImageResponse> findPostImagesByPostId(Long postId) {
        List<PostImageResponse> responses = new ArrayList<>();
        for (PostImage postImage : postImageRepository.findByPost_PostId(postId)) {
            responses.add(postImageMapper.toPostImageResponse(postImage));
        }
        return responses;
    }

    public PostImageResponse findPostImageById(Long imageId) {
        return postImageMapper.toPostImageResponse(findPostImage(imageId));
    }

    public PostImageResponse updatePostImage(Long imageId, PostImageUpdateRequest request) {
        PostImage postImage = findPostImage(imageId);
        postImageMapper.updatePostImage(postImage, request);
        if (request.getPostId() != null) {
            postImage.setPost(postRepository.findById(request.getPostId())
                    .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND)));
        }
        return postImageMapper.toPostImageResponse(postImageRepository.save(postImage));
    }

    public String deletePostImage(Long imageId) {
        postImageRepository.delete(findPostImage(imageId));
        return "Post image deleted successfully";
    }

    private PostImage findPostImage(Long imageId) {
        return postImageRepository.findById(imageId)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));
    }
}
