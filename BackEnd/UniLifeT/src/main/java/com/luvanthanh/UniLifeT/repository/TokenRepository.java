package com.luvanthanh.UniLifeT.repository;

import com.luvanthanh.UniLifeT.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenRepository extends JpaRepository<Token,Long> {
    boolean existsByTokenValue(String tokenValue);
    Token findByTokenId(Long tokenId);
}
