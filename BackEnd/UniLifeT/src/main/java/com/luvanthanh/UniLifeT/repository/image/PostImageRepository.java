package com.luvanthanh.UniLifeT.repository.image;

import com.luvanthanh.UniLifeT.entity.PostImage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostImageRepository extends JpaRepository<PostImage, Long> {
    List<PostImage> findByPost_PostId(Long postId);
}
