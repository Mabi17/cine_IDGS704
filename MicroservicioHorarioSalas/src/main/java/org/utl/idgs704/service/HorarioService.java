/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.idgs704.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.utl.idgs704.model.Horario;
import org.utl.idgs704.repository.HorarioRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


/**
 *
 * @author josea
 */
@Service
public class HorarioService {
        @Autowired
    private HorarioRepository horarioRepository;
    public List<Horario> ListarHorarios() {
      
        return horarioRepository.findAll(Sort.by(Sort.Order.asc("horaInicio")));
    }
    public Horario guardar (Horario horario) {
horario.setIdHorario(null);
        System.out.println(horario);
return horarioRepository.save (horario);
}
      public Horario modificar (Horario horario) {
return horarioRepository.save (horario);
}  
public Horario obtenerPorId (Long id) {
return horarioRepository.findById(id).orElse (null);
}
public void eliminar (Long id) {
horarioRepository.deleteById(id);
}
}
