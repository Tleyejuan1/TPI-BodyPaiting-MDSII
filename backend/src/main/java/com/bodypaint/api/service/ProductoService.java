package com.bodypaint.api.service;

import com.bodypaint.api.model.Producto;
import com.bodypaint.api.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductoService {
    @Autowired
    private ProductoRepository repository;

    public List<Producto> listarTodos() {
        return repository.findAll(); // Esto nos trae toda la lista de pinturas y pinceles
    }
}