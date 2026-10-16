package com.luvanthanh.UniLifeT.reponsitory;

import com.luvanthanh.UniLifeT.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PostRepository extends JpaRepository<Post,String> {
}
