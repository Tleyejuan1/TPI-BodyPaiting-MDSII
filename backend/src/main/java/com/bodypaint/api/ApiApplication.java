package com.bodypaint.api;

import com.bodypaint.api.model.Usuario;
import com.bodypaint.api.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ApiApplication {

    public static void main(String[] args) {
        // Esta línea inicia toda la aplicación Spring Boot
        SpringApplication.run(ApiApplication.class, args);
    }

    @Bean
    CommandLineRunner init(UsuarioRepository repository) {
        return args -> {
            // Buscamos si ya existe el admin para no duplicarlo en cada reinicio
            if (repository.findByUsername("admin").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setPassword("admin123"); // Contraseña de fábrica
                admin.setEmail("admin@gmail.com");
                admin.setRol("ADMIN");
                
                repository.save(admin);
                
                System.out.println("\n------------------------------------------------");
                System.out.println("---  ¡USUARIO ADMIN GENERADO CON ÉXITO!      ---");
                System.out.println("---  Usuario: admin                          ---");
                System.out.println("---  Contraseña: admin123                    ---");
                System.out.println("------------------------------------------------\n");
            } else {
                System.out.println("\n[INFO] El usuario 'admin' ya existe en la base de datos.\n");
            }
        };
    }
}