package com.luvanthanh.UniLifeT.reponsitory;


import com.luvanthanh.UniLifeT.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,String> {
}
