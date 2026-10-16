package com.luvanthanh.UniLifeT.exception;


import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter

public enum ErrorCode {
    ANOTHER_EXCEPTION(9999,"Lỗi không xác định", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_EXITS(1002, "user đã tồn tại", HttpStatus.NOT_ACCEPTABLE),
    USER_NAME_INVALID(1003,"user  name might be has more 3 characters", HttpStatus.BAD_REQUEST),
    PASSWORRD_INVALID(1004,"password might be has more 6 characters", HttpStatus.BAD_REQUEST),
    USER_NOTFIND(1005," không có user trong cơ sở dữ liệu", HttpStatus.BAD_REQUEST),
    NOT_AUTHENTICATED(1006,"không thể xác thực", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007," bạn không được phép truy cập",HttpStatus.FORBIDDEN),
    HETHAN_OR_NOT_VIRIFER(1008,"hết hạn token hoặc không đúng với virifer", HttpStatus.UNAUTHORIZED),
    ERROR_INJwtAuthenticationEntryPoint(1009,"lỗi ở lớp JwtAuthenticationEntryPoint",HttpStatus.UNAUTHORIZED)
    ;


    private int code;
    private String message;
    private HttpStatusCode httpStatusCode;

    ErrorCode(int code, String message,  HttpStatusCode httpStatusCode) {
        this.code = code;
        this.message = message;
        this.httpStatusCode = httpStatusCode;
    }
}

