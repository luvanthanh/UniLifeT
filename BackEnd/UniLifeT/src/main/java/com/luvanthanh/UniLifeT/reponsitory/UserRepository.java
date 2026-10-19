package com.luvanthanh.UniLifeT.reponsitory;


import com.luvanthanh.UniLifeT.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Boolean existsByUsername(String username);
    Optional<User> findByEmail (String email);
    Optional<User> findByUserName(String userName);
    Optional<User> findByUserId(Long id);
    void deleteUserByUserId(Long id);
}
