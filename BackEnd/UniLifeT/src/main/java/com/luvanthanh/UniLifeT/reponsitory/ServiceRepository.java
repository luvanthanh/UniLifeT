package com.luvanthanh.UniLifeT.reponsitory;


import com.luvanthanh.UniLifeT.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<Service,String> {

}
