package com.towerSharing.backend.config;

import java.util.List;

import org.h2.server.web.JakartaWebServlet;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class H2ConsoleConfig {

    @Bean
    public ServletRegistrationBean<?> h2ConsoleServletRegistration() {
        ServletRegistrationBean<JakartaWebServlet> registrationBean =
                new ServletRegistrationBean<>(new JakartaWebServlet(), "/h2-console", "/h2-console/*");
        registrationBean.addInitParameter("web-allow-others", "true");
        registrationBean.addInitParameter("trace", "true");
        registrationBean.setLoadOnStartup(1);
        registrationBean.setName("H2Console");
        registrationBean.setUrlMappings(List.of("/h2-console", "/h2-console/*"));
        return registrationBean;
    }
}
