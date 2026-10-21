package com.luvanthanh.UniLifeT.controller.image;

import com.luvanthanh.UniLifeT.dto.ApiResponse;
import com.luvanthanh.UniLifeT.dto.request.image.PostImageCreationRequest;
import com.luvanthanh.UniLifeT.dto.request.image.PostImageUpdateRequest;
import com.luvanthanh.UniLifeT.dto.response.image.PostImageResponse;
import com.luvanthanh.UniLifeT.service.image.PostImageService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/post-images")
public class PostImageController {

    @Autowired
    private PostImageService postImageService;

    @PostMapping
    public ApiResponse<PostImageResponse> createPostImage(@RequestBody PostImageCreationRequest request) {
        return ApiResponse.<PostImageResponse>builder()
                .code(1000)
                .message("Post image created successfully")
                .data(postImageService.createPostImage(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<PostImageResponse>> getAllPostImages() {
        return ApiResponse.<List<PostImageResponse>>builder()
                .code(1000)
                .message("Get all post images successful")
                .data(postImageService.findAllPostImages())
                .build();
    }

    @GetMapping("/{imageId}")
    public ApiResponse<PostImageResponse> getPostImageById(@PathVariable Long imageId) {
        return ApiResponse.<PostImageResponse>builder()
                .code(1000)
                .message("Get post image successful")
                .data(postImageService.findPostImageById(imageId))
                .build();
    }

    @PutMapping("/update/{imageId}")
    public ApiResponse<PostImageResponse> updatePostImage(
            @PathVariable Long imageId, @RequestBody PostImageUpdateRequest request) {
        return ApiResponse.<PostImageResponse>builder()
                .code(1000)
                .message("Post image updated successfully")
                .data(postImageService.updatePostImage(imageId, request))
                .build();
    }

    @DeleteMapping("/{imageId}")
    public ApiResponse<String> deletePostImage(@PathVariable Long imageId) {
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Post image deleted successfully")
                .data(postImageService.deletePostImage(imageId))
                .build();
    }
}
