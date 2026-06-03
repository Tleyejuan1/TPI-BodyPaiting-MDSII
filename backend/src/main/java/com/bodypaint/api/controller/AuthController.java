package com.bodypaint.api.controller;

import com.bodypaint.api.model.Usuario;
import com.bodypaint.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Fundamental para que Next.js (puerto 3000) pueda hablar con Java (8080)
public class AuthController {

    @Autowired
    private UsuarioRepository repository;

    // --- MÉTODO DE LOGIN ---
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Usuario loginData) {
        Optional<Usuario> user = repository.findByUsername(loginData.getUsername());
        
        if (user.isPresent() && user.get().getPassword().equals(loginData.getPassword())) {
            // Si las credenciales son correctas, devolvemos el ROL (ADMIN o CLIENTE)
            return ResponseEntity.ok(user.get().getRol());
        }
        
        // Si falla, devolvemos un error 401 (No autorizado) con el texto "ERROR"
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("ERROR");
    }

    // --- MÉTODO DE REGISTRO ---
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Usuario nuevoUsuario) {
        // 1. Verificamos si el nombre de usuario ya existe en la base de datos
        if (repository.findByUsername(nuevoUsuario.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("USUARIO_EXISTE");
        }

        // 2. Asignamos el rol CLIENTE por defecto para nuevos registros
        if (nuevoUsuario.getRol() == null || nuevoUsuario.getRol().isEmpty()) {
            nuevoUsuario.setRol("CLIENTE");
        }

        try {
            // 3. Guardamos el nuevo usuario en MySQL
            repository.save(nuevoUsuario);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("ERROR_DB");
        }
    }
}