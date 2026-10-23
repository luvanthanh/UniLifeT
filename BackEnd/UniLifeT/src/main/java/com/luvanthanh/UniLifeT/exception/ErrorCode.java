package com.luvanthanh.UniLifeT.exception;


import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter

public enum ErrorCode {
    ANOTHER_EXCEPTION(9999,"Lỗi không xác định", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_EXITS(1002, "user đã tồn tại", HttpStatus.NOT_ACCEPTABLE),
    USER_EMAIL_EXIST(10001, " user email đã tồn tại", HttpStatus.CONFLICT),
    USER_NAME_INVALID(1003,"user  name might be has more 3 characters", HttpStatus.BAD_REQUEST),
    PASSWORRD_INVALID(1004,"password might be has more 6 characters", HttpStatus.BAD_REQUEST),
    USER_NOTFIND(1005," không có user trong cơ sở dữ liệu", HttpStatus.BAD_REQUEST),
    NOT_AUTHENTICATED(1006,"không thể xác thực", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007," bạn không được phép truy cập",HttpStatus.FORBIDDEN),
    HETHAN_OR_NOT_VIRIFER(1008,"hết hạn token hoặc không đúng với virifer", HttpStatus.UNAUTHORIZED),
    ERROR_INJwtAuthenticationEntryPoint(1009,"Không được phép truy cập api này",HttpStatus.UNAUTHORIZED),
    UNIVERSITY_NOT_FOUND(1010, "không có đại học trong cơ sở dữ liệu", HttpStatus.NOT_FOUND),
    AMENITY_NOT_FOUND(1011, "không có tiện ích trong cơ sở dữ liệu", HttpStatus.NOT_FOUND),
    SERVICE_NOT_FOUND(1012, "không có dịch vụ trong cơ sở dữ liệu", HttpStatus.NOT_FOUND),
    ROOM_NOT_FOUND(1013, "không có phòng trong cơ sở dữ liệu", HttpStatus.NOT_FOUND),
    POST_NOT_FOUND(1014, "không có bài đăng trong cơ sở dữ liệu", HttpStatus.NOT_FOUND),
    MOTEL_NOT_FOUND(1015, "không có nhà trọ trong cơ sở dữ liệu", HttpStatus.NOT_FOUND),
    IMAGE_NOT_FOUND(1016, "không có hình ảnh trong cơ sở dữ liệu", HttpStatus.NOT_FOUND),
    USER_ROOM_NOT_FOUND(1017, "không có hợp đồng thuê phòng trong cơ sở dữ liệu", HttpStatus.NOT_FOUND),
    UNIVERSITY_HAVE_CODE(1018,"university đã có mã code này, lấy mã code khác", HttpStatus.BAD_REQUEST),
    ROOM_AMENITY_NOT_FOUND(1019, "không có tiện ích phòng trong cơ sở dữ liệu", HttpStatus.NOT_FOUND),
    ROOM_SERVICE_NOT_FOUND(1020, "không có dịch vụ phòng trong cơ sở dữ liệu", HttpStatus.NOT_FOUND)
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
