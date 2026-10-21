package com.luvanthanh.UniLifeT.controller;

import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.postRequest.PostCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.postRequest.PostUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.postResponse.PostResponse;
import com.luvanthanh.UniLifeT.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    public ApiResponse<PostResponse> createPost(@RequestBody PostCreationRequest request) {
        var result = postService.createPost(request);
        return ApiResponse.<PostResponse>builder()
                .code(1000)
                .message("Post created successfully")
                .data(result)
                .build();
    }

    @PutMapping("/{postId}")
    public ApiResponse<PostResponse> updatePost(
            @PathVariable Long postId, @RequestBody PostUpdateRequest request) {
        var result = postService.updatePost(postId, request);
        return ApiResponse.<PostResponse>builder()
                .code(1000)
                .message("Post updated successfully")
                .data(result)
                .build();
    }

    @GetMapping
    public ApiResponse<List<PostResponse>> getAllPosts() {
        var result = postService.findAllPosts();
        return ApiResponse.<List<PostResponse>>builder()
                .code(1000)
                .message("Get all posts successful")
                .data(result)
                .build();
    }

    @GetMapping("/{postId}")
    public ApiResponse<PostResponse> getPostById(@PathVariable Long postId) {
        var result = postService.findPostById(postId);
        return ApiResponse.<PostResponse>builder()
                .code(1000)
                .message("Get post successful")
                .data(result)
                .build();
    }

    @DeleteMapping("/{postId}")
    public ApiResponse<String> deletePost(@PathVariable Long postId) {
        var result = postService.deletePost(postId);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Delete post successful")
                .data(result)
                .build();
    }
}
