package com.luvanthanh.UniLifeT.repository;

import com.luvanthanh.UniLifeT.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenRepository extends JpaRepository<Token,Long> {
    Boolean  existsByTokenId(String tokenId);
    Token findByTokenId(String tokenId);
}
