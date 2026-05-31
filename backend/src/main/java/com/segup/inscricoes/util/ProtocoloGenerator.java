package com.segup.inscricoes.util;

import com.segup.inscricoes.repository.InscricaoRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class ProtocoloGenerator {

    private static final DateTimeFormatter FORMATO_DATA = DateTimeFormatter.ofPattern("yyyyMMdd");

    private final InscricaoRepository inscricaoRepository;

    public ProtocoloGenerator(InscricaoRepository inscricaoRepository) {
        this.inscricaoRepository = inscricaoRepository;
    }

    /**
     * Gera protocolo no formato INS-YYYYMMDD-XXXX onde XXXX é a sequência do dia.
     * A sequência é baseada na contagem atual de inscrições do dia + 1.
     * Em ambiente de alto volume, considere usar uma sequence de banco de dados
     * para evitar colisões em requisições simultâneas.
     */
    public String gerar() {
        LocalDate hoje = LocalDate.now();
        String dataFormatada = hoje.format(FORMATO_DATA);

        LocalDateTime inicioDia = hoje.atStartOfDay();
        LocalDateTime fimDia = hoje.plusDays(1).atStartOfDay();

        long totalHoje = inscricaoRepository.contarPorDia(inicioDia, fimDia);
        long sequencia = totalHoje + 1;

        return String.format("INS-%s-%04d", dataFormatada, sequencia);
    }
}
