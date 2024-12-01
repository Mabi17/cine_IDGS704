/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package org.utl.idgs704.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.utl.idgs704.model.Horario;

/**
 *
 * @author josea
 */
public interface HorarioRepository extends JpaRepository<Horario, Long>{
    
}
