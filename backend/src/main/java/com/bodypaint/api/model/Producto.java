package com.bodypaint.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "productos")
@Data // Esto de Lombok genera automáticamente Getters y Setters
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String marca;
    private Integer stock;

    @Column(name = "stock_minimo")
    private Integer stockMinimo; // Para la alerta en rojo que pide el TPI

    private BigDecimal precio;

    @Column(name = "imagen_url")
    private String imagenUrl; // Para guardar la ruta de la foto PNG/JPG

    private Boolean activo = true; // Para dar de baja productos sin borrarlos[cite: 1]
}