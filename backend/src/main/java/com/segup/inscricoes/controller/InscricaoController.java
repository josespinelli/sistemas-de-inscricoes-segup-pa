package com.segup.inscricoes.controller;

import com.segup.inscricoes.dto.InscricaoRequestDTO;
import com.segup.inscricoes.dto.InscricaoResponseDTO;
import com.segup.inscricoes.service.InscricaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscricoes")
@Tag(name = "Inscrições", description = "Gerenciamento de inscrições da SEGUP/PA")
public class InscricaoController {

    private final InscricaoService inscricaoService;

    public InscricaoController(InscricaoService inscricaoService) {
        this.inscricaoService = inscricaoService;
    }

    @PostMapping
    @Operation(summary = "Criar nova inscrição")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Inscrição criada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    public ResponseEntity<InscricaoResponseDTO> criar(@Valid @RequestBody InscricaoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inscricaoService.criar(dto));
    }

    @GetMapping
    @Operation(summary = "Listar todas as inscrições")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    public ResponseEntity<List<InscricaoResponseDTO>> listarTodas() {
        return ResponseEntity.ok(inscricaoService.listarTodas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar inscrição por ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Inscrição encontrada"),
        @ApiResponse(responseCode = "404", description = "Inscrição não encontrada")
    })
    public ResponseEntity<InscricaoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(inscricaoService.buscarPorId(id));
    }

    @GetMapping("/protocolo/{protocolo}")
    @Operation(summary = "Buscar inscrição por protocolo")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Inscrição encontrada"),
        @ApiResponse(responseCode = "404", description = "Protocolo não encontrado")
    })
    public ResponseEntity<InscricaoResponseDTO> buscarPorProtocolo(@PathVariable String protocolo) {
        return ResponseEntity.ok(inscricaoService.buscarPorProtocolo(protocolo));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar inscrição (apenas se CONFIRMADA)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Inscrição atualizada"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "404", description = "Inscrição não encontrada"),
        @ApiResponse(responseCode = "409", description = "Inscrição cancelada não pode ser alterada")
    })
    public ResponseEntity<InscricaoResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody InscricaoRequestDTO dto) {
        return ResponseEntity.ok(inscricaoService.atualizar(id, dto));
    }

    @PatchMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar inscrição")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Inscrição cancelada"),
        @ApiResponse(responseCode = "404", description = "Inscrição não encontrada"),
        @ApiResponse(responseCode = "409", description = "Inscrição já está cancelada")
    })
    public ResponseEntity<InscricaoResponseDTO> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(inscricaoService.cancelar(id));
    }
}
