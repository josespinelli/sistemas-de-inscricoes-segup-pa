package com.segup.inscricoes.service;

import com.segup.inscricoes.dto.InscricaoRequestDTO;
import com.segup.inscricoes.dto.InscricaoResponseDTO;
import com.segup.inscricoes.entity.Inscricao;
import com.segup.inscricoes.entity.StatusInscricao;
import com.segup.inscricoes.exception.ResourceNotFoundException;
import com.segup.inscricoes.repository.InscricaoRepository;
import com.segup.inscricoes.util.ProtocoloGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InscricaoService {

    private final InscricaoRepository inscricaoRepository;
    private final ProtocoloGenerator protocoloGenerator;

    public InscricaoService(InscricaoRepository inscricaoRepository, ProtocoloGenerator protocoloGenerator) {
        this.inscricaoRepository = inscricaoRepository;
        this.protocoloGenerator = protocoloGenerator;
    }

    @Transactional
    public InscricaoResponseDTO criar(InscricaoRequestDTO dto) {
        Inscricao inscricao = new Inscricao();
        inscricao.setNomeCompleto(dto.getNomeCompleto());
        inscricao.setCpf(dto.getCpf());
        inscricao.setEmail(dto.getEmail());
        inscricao.setTelefone(dto.getTelefone());
        inscricao.setServico(dto.getServico());
        inscricao.setObservacao(dto.getObservacao());
        inscricao.setStatus(StatusInscricao.CONFIRMADA);
        inscricao.setProtocolo(protocoloGenerator.gerar());

        return toResponseDTO(inscricaoRepository.save(inscricao));
    }

    @Transactional(readOnly = true)
    public List<InscricaoResponseDTO> listarTodas() {
        return inscricaoRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InscricaoResponseDTO buscarPorId(Long id) {
        return toResponseDTO(encontrarPorId(id));
    }

    @Transactional(readOnly = true)
    public InscricaoResponseDTO buscarPorProtocolo(String protocolo) {
        Inscricao inscricao = inscricaoRepository.findByProtocolo(protocolo)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Inscrição não encontrada para o protocolo: " + protocolo));
        return toResponseDTO(inscricao);
    }

    @Transactional
    public InscricaoResponseDTO atualizar(Long id, InscricaoRequestDTO dto) {
        Inscricao inscricao = encontrarPorId(id);

        if (inscricao.getStatus() == StatusInscricao.CANCELADA) {
            throw new IllegalStateException("Não é possível atualizar uma inscrição cancelada.");
        }

        inscricao.setNomeCompleto(dto.getNomeCompleto());
        inscricao.setCpf(dto.getCpf());
        inscricao.setEmail(dto.getEmail());
        inscricao.setTelefone(dto.getTelefone());
        inscricao.setServico(dto.getServico());
        inscricao.setObservacao(dto.getObservacao());

        return toResponseDTO(inscricaoRepository.save(inscricao));
    }

    @Transactional
    public InscricaoResponseDTO cancelar(Long id) {
        Inscricao inscricao = encontrarPorId(id);

        if (inscricao.getStatus() == StatusInscricao.CANCELADA) {
            throw new IllegalStateException("A inscrição já está cancelada.");
        }

        inscricao.setStatus(StatusInscricao.CANCELADA);
        return toResponseDTO(inscricaoRepository.save(inscricao));
    }

    private Inscricao encontrarPorId(Long id) {
        return inscricaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Inscrição não encontrada com id: " + id));
    }

    private InscricaoResponseDTO toResponseDTO(Inscricao inscricao) {
        InscricaoResponseDTO dto = new InscricaoResponseDTO();
        dto.setId(inscricao.getId());
        dto.setProtocolo(inscricao.getProtocolo());
        dto.setNomeCompleto(inscricao.getNomeCompleto());
        dto.setCpf(inscricao.getCpf());
        dto.setEmail(inscricao.getEmail());
        dto.setTelefone(inscricao.getTelefone());
        dto.setServico(inscricao.getServico());
        dto.setObservacao(inscricao.getObservacao());
        dto.setStatus(inscricao.getStatus());
        dto.setDataCriacao(inscricao.getDataCriacao());
        dto.setDataAtualizacao(inscricao.getDataAtualizacao());
        return dto;
    }
}
