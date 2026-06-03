package com.bodypaint.api.repository;

import com.bodypaint.api.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // Acá Spring hace la magia y nos da los métodos para buscar productos solo
}