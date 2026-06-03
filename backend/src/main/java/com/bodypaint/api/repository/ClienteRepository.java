package com.bodypaint.api.repository;

import com.bodypaint.api.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    // este sirve para buscar por mail cuando el cliente se loguea o registra
    Optional<Cliente> findByEmail(String email); 
    
    // ver punto 2: el cliente tiene q tener varias direccinoes? 
    // el enunciado dise que puede agregar nuevas al comprar
}