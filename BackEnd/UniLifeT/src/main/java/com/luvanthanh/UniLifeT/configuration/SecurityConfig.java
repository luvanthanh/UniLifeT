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
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;

import java.util.List;

import static org.springframework.http.HttpMethod.*;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity

public class SecurityConfig {
    private final String[] PRIVATE_GET_ENDPOINTS={
            "/users",
            "/users/{userId}"
    };
    private final String[] PUBLIC_POST_ENDPOINTS = {
            "/users",
            "/users/auth/register",
            "/users/auth/login",
            "/users/auth/introspect",
            "/users/auth/logout"
    };
    public final String[] PUBLIC_GET_ENDPOINTS = {
            "/universities",
            "/universities/*",
            "/amenities",
            "/amenities/*",
            "/services",
            "/services/*",
            "/rooms",
            "/rooms/{roomId}",
            "/room-service",
            "/room-service/{roomServiceId}",
            "/room-service/get-room-service/{roomId}",

            "/room-amenity",
            "/room-amenity/{roomAmenityId}",
            "/room-amenity/get-room-amenity/{roomId}",

            "/posts",
            "/posts/*",
            "/room-reviews/room/*",
            "/post-images",
            "/post-images/*",
            "/post-images/get-post-image/*",
            "/motel-images",
            "/motel-images/*",
            "/motel-images/get-motel-image/*",
            "/room-images",
            "/room-images/*",
            "/room-images/get-room-image/*",
            "/motels",
            "/motels/*"

    };

    private final CustomJwtDecoder customJwtDecoder;

    public SecurityConfig(CustomJwtDecoder customJwtDecoder) {
        this.customJwtDecoder = customJwtDecoder;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(POST, PUBLIC_POST_ENDPOINTS).permitAll()
                        .requestMatchers(GET, PUBLIC_GET_ENDPOINTS).permitAll()
                        .requestMatchers(GET, "/users/me").authenticated()
                        .requestMatchers(GET, PRIVATE_GET_ENDPOINTS).hasRole("ADMIN")
                        .requestMatchers(POST, "/posts", "/room-service", "/room-amenity",
                                "/room-images", "/motel-images", "/post-images",
                                "/rooms", "/motels")
                                .hasAnyRole("ADMIN", "OWNER")
                        .requestMatchers(POST, "/universities", "/amenities", "/services")
                                .hasRole("ADMIN")
                        .requestMatchers(PUT, "/posts/**", "/rooms/update/**", "/motels/**",
                                "/room-images/**", "/motel-images/**", "/post-images/**",
                                "/room-service/**", "/room-amenity/**")
                                .hasAnyRole("ADMIN", "OWNER")
                        .requestMatchers(PUT, "/universities/**", "/amenities/**", "/services/**")
                                .hasRole("ADMIN")
                        .requestMatchers(DELETE, "/posts/**", "/rooms/**", "/motels/**",
                                "/room-images/**", "/motel-images/**", "/post-images/**",
                                "/room-service/**", "/room-amenity/**")
                                .hasAnyRole("ADMIN", "OWNER")
                        .requestMatchers(DELETE, "/universities/**", "/amenities/**", "/services/**")
                                .hasRole("ADMIN")
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



    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "http://127.0.0.1:5501",
                "http://localhost:5501",
                "http://127.0.0.1:5502",
                "http://localhost:5502",
                "http://127.0.0.1:5503",
                "http://localhost:5503",
                "http://localhost:8765",
                "http://127.0.0.1:8765"
        ));

        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
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
