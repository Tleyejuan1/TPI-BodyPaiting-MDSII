package com.bodypaint.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "kits")
@Data
public class Kit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    
    // el precio del kit no depende de los productos q tiene adentro segun el punto 2
    private BigDecimal precioKit; 

    // aca se pone peluda la cosa... un kit tiene muchos productos
    // ver punto 2, los kits pueden tener otros kits?
    // por ahora hagamos la relacion simple con productos 
    @ManyToMany
    @JoinTable(
        name = "kit_productos",
        joinColumns = @JoinColumn(name = "kit_id"),
        inverseJoinColumns = @JoinColumn(name = "producto_id")
    )
    private List<Producto> productos;

    private Boolean activo = true; // x si el admin lo quiere dar de baja[punto 1]
}