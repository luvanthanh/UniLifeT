package com.luvanthanh.UniLifeT.exception;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor

public class AppException extends  RuntimeException{
    private ErrorCode  errorCode;
    public AppException(ErrorCode errorCode){
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

}
