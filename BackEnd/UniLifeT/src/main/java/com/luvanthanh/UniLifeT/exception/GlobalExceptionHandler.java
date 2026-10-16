package com.luvanthanh.UniLifeT.exception;


import com.luvanthanh.UniLifeT.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ApiResponse> handleException(RuntimeException e) {

        ApiResponse responseAPI = new ApiResponse();

        responseAPI.setCode(ErrorCode.ANOTHER_EXCEPTION.getCode());
        responseAPI.setMessage(ErrorCode.ANOTHER_EXCEPTION.getMessage());

        return ResponseEntity
                .status(ErrorCode.ANOTHER_EXCEPTION.getHttpStatusCode())
                .body(responseAPI);
    }

    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<ApiResponse> handlingAppException(AppException e) {

        ApiResponse responseAPI = new ApiResponse<>();

        ErrorCode errorCode = e.getErrorCode();

        responseAPI.setCode(errorCode.getCode());
        responseAPI.setMessage(errorCode.getMessage());

        return ResponseEntity
                .status(errorCode.getHttpStatusCode())
                .body(responseAPI);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    public ResponseEntity<ApiResponse> handlingAccessDeniedException(
            AccessDeniedException e) {

        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;

        return ResponseEntity
                .status(errorCode.getHttpStatusCode())
                .body(ApiResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build());
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidException(
            MethodArgumentNotValidException e) {

        String enumKey = e.getFieldError().getDefaultMessage();

        ErrorCode errorCode = ErrorCode.valueOf(enumKey);

        ApiResponse responseAPI = new ApiResponse<>();

        responseAPI.setCode(errorCode.getCode());
        responseAPI.setMessage(errorCode.getMessage());

        return ResponseEntity
                .badRequest()
                .body(responseAPI);
    }
}