package com.luvanthanh.UniLifeT.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.http.HttpMethod.*;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity

public class SecurityConfig {
    private final String[] PRIVATE_POST_ENDPOINTS ={
            "/rooms",
            "/motels"
    };

    private final String[] PRIVATE_PUT_ENDPOINTS={
            "/rooms/{roomId}",
            "/motels/{motelId}"

    };
    private final String[] PRIVATE_DELETE_ENDPOINTS={
            "/rooms/{roomId}",
            "/motels/{motelId}",

    };

    private final String[] PRIVATE_GET_ENDPOINTS={
            "/users",
            "/users/{userId}"
    };
    private final String[] PUBLIC_POST_ENDPOINTS = {
            "/users",
            "/users/auth/register",
            "/users/auth/login",
            "/users/auth/introspect",
            "/users/auth/logout",

            "/posts"
    };
    public final String[] PUBLIC_GET_ENDPOINTS = {
            "/universities",
            "/universities/*",
            "/amenities",
            "/amenities/*",
            "/services",
            "/services/*",
            "/roms",
            "/roms/{roomId}",
            "/posts",
            "/posts/*",
            "/post-images",
            "/post-images/*",
            "/motel-images",
            "/motel-images/*",
            "/room-images",
            "/room-images/*",
            "/motels",
            "/motels/*",
            "/user-room/users/{userId}"
    };

    private final String[] PUBLIC_PUT_ENDPOINTS = {
            "/posts/{postId}"
    };

    private final String[] PUBLIC_DELETE_ENDPOINTS = {

    };

    private final CustomJwtDecoder customJwtDecoder;

    public SecurityConfig(CustomJwtDecoder customJwtDecoder) {
        this.customJwtDecoder = customJwtDecoder;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
//               .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .cors(AbstractHttpConfigurer::disable)                                                  // tắt cors để không bị trùng công frontend
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(POST, PUBLIC_POST_ENDPOINTS).permitAll()
                        .requestMatchers(GET, PUBLIC_GET_ENDPOINTS).permitAll()
                        .requestMatchers(PUT, PUBLIC_PUT_ENDPOINTS).permitAll()

                        .requestMatchers(GET, PRIVATE_GET_ENDPOINTS).hasRole("ADMIN")
                        .requestMatchers(POST, PRIVATE_POST_ENDPOINTS).hasAnyRole("ADMIN", "OWNER")
                        .requestMatchers(PUT, PRIVATE_PUT_ENDPOINTS).hasAnyRole("ADMIN", "OWNER")
                        .requestMatchers(DELETE, PRIVATE_DELETE_ENDPOINTS).hasAnyRole("ADMIN", "OWNER")
                        .requestMatchers(DELETE,"/users/{userId}").hasRole("ADMIN")
                        .requestMatchers(PUT,"/users/{userId}").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )

                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(customJwtDecoder)
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                        )
                        .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
                );

        return http.build();
    }

    // hàm này chỉ dùng đổi đổi scope thành roles
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_"); // đổi tên scope -> ROLE_

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return converter;
    }
}
