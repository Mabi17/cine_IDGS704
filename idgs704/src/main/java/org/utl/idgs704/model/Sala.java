package org.utl.idgs704.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Salas")
public class Sala {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sala")
    private long idSala;

    @Column(name = "nombreSala")
    private String nombreSala;

    @Column(name = "capacidad")
    private int capacidad;

    @Column(name = "estado")
    private String estado;

    @Column(name = "tipoRendimiento")
    private String tipoRendimiento;

    public Sala() {
    }

    public Sala(long idSala, String nombreSala, int capacidad, String estado, String tipoRendimiento) {
        this.idSala = idSala;
        this.nombreSala = nombreSala;
        this.capacidad = capacidad;
        this.estado = estado;
        this.tipoRendimiento = tipoRendimiento;
    }

    public long getIdSala() {
        return idSala;
    }

    public void setIdSala(long idSala) {
        this.idSala = idSala;
    }

    public String getNombreSala() {
        return nombreSala;
    }

    public void setNombreSala(String nombreSala) {
        this.nombreSala = nombreSala;
    }

    public int getCapacidad() {
        return capacidad;
    }

    public void setCapacidad(int capacidad) {
        this.capacidad = capacidad;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getTipoRendimiento() {
        return tipoRendimiento;
    }

    public void setTipoRendimiento(String tipoRendimiento) {
        this.tipoRendimiento = tipoRendimiento;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Sala{");
        sb.append("idSala=").append(idSala);
        sb.append(", nombreSala=").append(nombreSala);
        sb.append(", capacidad=").append(capacidad);
        sb.append(", estado=").append(estado);
        sb.append(", tipoRendimiento=").append(tipoRendimiento);
        sb.append('}');
        return sb.toString();
    }
}
