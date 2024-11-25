package org.utl.idgs704.model;

import jakarta.persistence.*;
import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "Proyecciones")
public class Proyeccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Proyeccion")
    private Long idProyeccion;

      @ManyToOne(fetch = FetchType.LAZY) // Cambia a EAGER si es necesario
    @JoinColumn(name = "id_pelicula")
    private Pelicula pelicula;

    @ManyToOne(fetch = FetchType.LAZY) // Cambia a EAGER si es necesario
    @JoinColumn(name = "id_sala")
    private Sala sala;

    @Column(name = "fecha")
    private Date fecha;

    @Column(name = "hora")
    private Time hora;

    public Proyeccion() {
    }

    public Proyeccion(Long idProyeccion, String nombreSala, Pelicula pelicula, Sala sala, Date fecha, Time hora) {
        this.idProyeccion = idProyeccion;
        this.pelicula = pelicula;
        this.sala = sala;
        this.fecha = fecha;
        this.hora = hora;
    }

    public long getIdProyeccion() {
        return idProyeccion;
    }

    public void setIdProyeccion(Long idProyeccion) {
        this.idProyeccion = idProyeccion;
    }

    public Pelicula getPelicula() {
        return pelicula;
    }

    public void setPelicula(Pelicula pelicula) {
        this.pelicula = pelicula;
    }

    public Sala getSala() {
        return sala;
    }

    public void setSala(Sala sala) {
        this.sala = sala;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public Time getHora() {
        return hora;
    }

    public void setHora(Time hora) {
        this.hora = hora;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Proyeccion{");
        sb.append("idProyeccion=").append(idProyeccion);
        sb.append(", pelicula=").append(pelicula.toString());
        sb.append(", sala=").append(sala.toString());
        sb.append(", fecha=").append(fecha);
        sb.append(", hora=").append(hora);
        sb.append('}');
        return sb.toString();
    }
}
