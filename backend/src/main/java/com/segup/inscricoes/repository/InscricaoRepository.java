package com.segup.inscricoes.repository;

import com.segup.inscricoes.entity.Inscricao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface InscricaoRepository extends JpaRepository<Inscricao, Long> {

    Optional<Inscricao> findByProtocolo(String protocolo);

    @Query("SELECT COUNT(i) FROM Inscricao i WHERE i.dataCriacao >= :inicio AND i.dataCriacao < :fim")
    long contarPorDia(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);
}
