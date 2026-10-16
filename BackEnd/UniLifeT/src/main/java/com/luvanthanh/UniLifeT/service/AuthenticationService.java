package com.luvanthanh.UniLifeT.service;

import com.luvanthanh.UniLifeT.dto.request.anthenticated.AuthenticationRequest;
import com.luvanthanh.UniLifeT.dto.response.authenticatedResponse.AuthenticationResponse;
import com.luvanthanh.UniLifeT.entity.User;
import com.luvanthanh.UniLifeT.exception.AppException;
import com.luvanthanh.UniLifeT.exception.ErrorCode;
import com.luvanthanh.UniLifeT.reponsitory.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
@Slf4j
public class AuthenticationService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InvalidatedTokenRepository invalidatedTokenRepository;

    @Value("${jwt.signerKey}")
    private String SINGER_KEY;



    private String generateToken(User user)
    {
        JWSHeader jwsHeader= new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet= new JWTClaimsSet.Builder()
                .subject(user.getUserName())
                .issuer("Van Thanh Shop")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString()) // random chuỗi kí tự
                .claim("scope",user.getUserRole()) //
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(jwsHeader,payload);

        try
        {
            jwsObject.sign(new MACSigner(SINGER_KEY.getBytes()));
            return  jwsObject.serialize();
        }
        catch (JOSEException exception)
        {
            log.error("can't generate token, error message:",exception);
            throw new RuntimeException(exception);
        }
    }

    public IntrospectResponse introspect( IntrospectRequest request)
            throws JOSEException, ParseException
    {
        var token = request.getToken();
        boolean checkTokenInvalidate = true;

        try{
            verifyToken(token);
        }catch(AppException exception){
            checkTokenInvalidate = false;
        }

        return  IntrospectResponse.builder()
                .checkToken(checkTokenInvalidate)
                .build();

    }

    public SignedJWT verifyToken (String token) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SINGER_KEY.getBytes()); // tạo 1 JWSVerifier với cái SINGER_KEY
        SignedJWT signedJWT = SignedJWT.parse(token); // để giải mã cái token này ra gồm 3 phần

        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime(); // sau khi giải mã sẽ kiểm tra xem token còn hạn hay không
        var verified = signedJWT.verify(verifier); // sau khi giải mã token thì sẽ xác minh chữ kí trong đấy với verifier

        if(!(verified && expiryTime.after(new Date())))
            throw new AppException(ErrorCode.HETHAN_OR_NOT_VIRIFER);

        if(invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())){
            throw new AppException(ErrorCode.NOT_AUTHENTICATED);
        }

        return signedJWT;
    }

    // check xem có đăng nhập đúng không
    public AuthenticationResponse login(AuthenticationRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        var user = userRepository.findByUserName(request.getUserName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFIND));


        boolean checkPassword = passwordEncoder.matches(request.getUserPassword(), user.getUserPassword());

        if(!checkPassword) {
            throw new AppException(ErrorCode.PASSWORRD_INVALID);
        }

        else{
            var token = generateToken(user); // sinh token khi đăng nhập với tài khoàn đúng

            return AuthenticationResponse.builder()
                    .checkAuthenticated(true)
                    .token(token)
                    .userId(user.getUserId())
                    .build();

        }
    }

    public InvalidatedToken logout(LogoutRequest request) throws ParseException, JOSEException {
        var signToken = verifyToken(request.getToken());

        String jit = signToken.getJWTClaimsSet().getJWTID();
        Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(jit)
                .expiryTime(expiryTime)
                .build();

        return invalidatedTokenRepository.save(invalidatedToken);
    }
}
