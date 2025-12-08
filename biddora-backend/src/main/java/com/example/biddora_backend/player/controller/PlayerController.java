package com.example.biddora_backend.player.controller;

import com.example.biddora_backend.player.dto.CreatePlayerDto;
import com.example.biddora_backend.player.dto.PlayerDto;
import com.example.biddora_backend.player.enums.Nationality;
import com.example.biddora_backend.player.enums.PlayerRole;
import com.example.biddora_backend.player.enums.PlayerStatus;
import com.example.biddora_backend.player.service.PlayerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    // Public: Everyone can view players
    @GetMapping("/{id}")
    public ResponseEntity<PlayerDto> getPlayerById(@PathVariable Long id) {
        return ResponseEntity.ok(playerService.getPlayerById(id));
    }

    // Public: Filterable list (Search by Name, Status, Role, Nationality)
    @GetMapping("/all")
    public ResponseEntity<Page<PlayerDto>> getAllPlayers(
            @RequestParam Optional<Integer> page,
            @RequestParam Optional<String> sortBy,
            @RequestParam Optional<String> name,
            @RequestParam Optional<PlayerStatus> status,
            @RequestParam Optional<PlayerRole> role,
            @RequestParam Optional<Nationality> nationality) {

        return ResponseEntity.ok(playerService.getAllPlayers(page, sortBy, name, status, role, nationality));
    }

    // Admin Only: Add new player to the pool
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlayerDto> addPlayer(@Valid @RequestBody CreatePlayerDto createPlayerDto) {
        return ResponseEntity.ok(playerService.addPlayer(createPlayerDto));
    }

    // Admin Only: Delete player
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deletePlayer(@PathVariable Long id) {
        return ResponseEntity.ok(playerService.deletePlayer(id));
    }
}