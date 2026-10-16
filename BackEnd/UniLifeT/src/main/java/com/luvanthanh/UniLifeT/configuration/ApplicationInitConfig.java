package com.luvanthanh.UniLifeT.configuration;

import com.luvanthanh.UniLifeT.Enum.Role;
import com.luvanthanh.UniLifeT.entity.User;
import com.luvanthanh.UniLifeT.reponsitory.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Slf4j
public class ApplicationInitConfig {
    @Bean
    ApplicationRunner initApplicationRunner(UserRepository userRepository) {
        return args -> {
            if(userRepository.findByUserName("admin").isEmpty()) {
                var roles = Role.ADMIN.name();
                PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

                User user = User.builder()
                        .userName("admin")
                        .userPassword(passwordEncoder.encode("admin"))
                        .userRole(roles)
                        .build();
                userRepository.save(user);
                log.warn("admin has been created with default password: admin please change it");
            }
        };

    }
}
