/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.idgs704.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.utl.idgs704.repository.ProyeccionRepository;
import org.utl.idgs704.model.Proyeccion;
/**
 *
 * @author josea
 */
@Service
public class ProyeccionService {
    @Autowired
    private ProyeccionRepository proyeccionRepository;
    public List<Proyeccion> ListarProyecciones(){
      
    return proyeccionRepository.findAll();
}
    
}
