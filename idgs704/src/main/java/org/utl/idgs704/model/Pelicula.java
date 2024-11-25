package org.utl.idgs704.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Películas")
public class Pelicula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_Pelicula")
    private long idPeliculas;

    @Column(name = "titulo")
    private String titulo;

    @Column(name = "duracion")
    private int duracion;

    @Column(name = "clasificacion")
    private String clasificacion;

    @Column(name = "genero")
    private String genero;

    @Column(name = "sinopsis")
    private String sinopsis;

    public Pelicula() {
    }

    public Pelicula(long idPeliculas, String titulo, int duracion, String clasificacion, String genero, String sinopsis) {
        this.idPeliculas = idPeliculas;
        this.titulo = titulo;
        this.duracion = duracion;
        this.clasificacion = clasificacion;
        this.genero = genero;
        this.sinopsis = sinopsis;
    }

    public long getIdPeliculas() {
        return idPeliculas;
    }

    public void setIdPeliculas(long idPeliculas) {
        this.idPeliculas = idPeliculas;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public int getDuracion() {
        return duracion;
    }

    public void setDuracion(int duracion) {
        this.duracion = duracion;
    }

    public String getClasificacion() {
        return clasificacion;
    }

    public void setClasificacion(String clasificacion) {
        this.clasificacion = clasificacion;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getSinopsis() {
        return sinopsis;
    }

    public void setSinopsis(String sinopsis) {
        this.sinopsis = sinopsis;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Pelicula{");
        sb.append("idPeliculas=").append(idPeliculas);
        sb.append(", titulo=").append(titulo);
        sb.append(", duracion=").append(duracion);
        sb.append(", clasificacion=").append(clasificacion);
        sb.append(", genero=").append(genero);
        sb.append(", sinopsis=").append(sinopsis);
        sb.append('}');
        return sb.toString();
    }
}
