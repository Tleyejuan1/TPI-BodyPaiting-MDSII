package com.bodypaint.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "clientes")
@Data
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellido;
    private String email;

    // Datos de dirección según el enunciado[cite: 1]
    private String pais;
    private String provincia;
    private String localidad;
    private String calle;
    private String numero;
    private String piso;
    private String departamento;
}