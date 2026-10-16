package com.luvanthanh.UniLifeT.dto;

import com.luvanthanh.UniLifeT.entity.Amenity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse<T> {
    private int  code;
    private String message;
    private T data;
}
