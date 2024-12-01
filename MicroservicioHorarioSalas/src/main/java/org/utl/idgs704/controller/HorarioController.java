/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.idgs704.controller;

import java.time.Duration;
import java.time.LocalTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.utl.idgs704.model.Horario;
import org.utl.idgs704.service.HorarioService;

/**
 *
 * @author josea
 */
@Controller
@RequestMapping("/horarioSalas")
public class HorarioController {
    @Autowired
    private HorarioService horarioService;
    
    @GetMapping
    public String listarHorarios(Model model){
        model.addAttribute("horarios",horarioService.ListarHorarios());
        System.out.println(model.toString());
        return  "HorariosProyecciones";
    }

    @GetMapping("/api/horarios")
    @ResponseBody
    public List<Horario> getAllHorarios() {
        return horarioService.ListarHorarios();
    }
    
    
    @PostMapping("/acciones/horarios")
public String manejarHorario(
    @RequestParam String action,
    @ModelAttribute Horario horario,
    Model model
) {

     Duration duration = Duration.between(horario.getHoraInicio(), horario.getHoraFin());
        
        long hours = duration.toHours();
        long minutes = duration.toMinutes() % 60;
        LocalTime tiempoTotal = LocalTime.of((int) hours, (int) minutes); 
        
        horario.setTiempoTotal(tiempoTotal);
        System.out.println("Acción recibida: " + action);
    System.out.println("Horario recibido: " + horario);
    

    switch (action) {
        case "add":
            horarioService.guardar(horario);
            break;
        case "edit":
   
                horarioService.modificar(horario); // Actualiza si ya existe
         
     
            
            break;
        case "delete":
           // Verificamos que idHorario no sea 0
                horarioService.eliminar(horario.getIdHorario());
           
            break;
        default:
            model.addAttribute("error", "Acción no reconocida");
    }
    return "redirect:/horarioSalas";
}


}
