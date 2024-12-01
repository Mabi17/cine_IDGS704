/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.idgs704.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalTime;


/**
 *
 * @author josea
 */
@Entity
public class Horario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idHorario;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private LocalTime tiempoTotal;

    public Horario() {
    }

    public Horario(Long idHorario, LocalTime horaInicio, LocalTime horaFin, LocalTime tiempoTotal) {
        this.idHorario = idHorario;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.tiempoTotal = tiempoTotal;
    }

    public long getIdHorario() {
        return idHorario;
    }

    public void setIdHorario(Long idHorario) {
        this.idHorario = idHorario;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    public LocalTime getTiempoTotal() {
        return tiempoTotal;
    }

    public void setTiempoTotal(LocalTime tiempoTotal) {
        this.tiempoTotal = tiempoTotal;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Horario{");
        sb.append("idHorario=").append(idHorario);
        sb.append(", horaInicio=").append(horaInicio);
        sb.append(", horaFin=").append(horaFin);
        sb.append(", tiempoTotal=").append(tiempoTotal);
        sb.append('}');
        return sb.toString();
    }
    
    
}
