package com.bodypaint.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// este es solo pa ver si esto anda bien che
@RestController
public class TestController {

    @GetMapping("/test")
    public String holaMundo() {
        // si ves esto en el navegador es q vamos por buen camino
        return "La API de Body Paint ya esta corriendo... vamos!";
    }
    
    // dsp aca hay q meter los de verdad para el Cliente, Vendedor y Admin
}