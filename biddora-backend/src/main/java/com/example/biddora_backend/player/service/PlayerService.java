package com.example.biddora_backend.player.service;

import com.example.biddora_backend.player.dto.CreatePlayerDto;
import com.example.biddora_backend.player.dto.PlayerDto;
import com.example.biddora_backend.player.dto.UpdatePlayerDto;
import com.example.biddora_backend.player.enums.Nationality;
import com.example.biddora_backend.player.enums.PlayerRole;
import com.example.biddora_backend.player.enums.PlayerStatus;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface PlayerService {
    PlayerDto addPlayer(CreatePlayerDto createPlayerDto);
    PlayerDto getPlayerById(Long playerId);
    PlayerDto updatePlayer(Long playerId, UpdatePlayerDto updatePlayerDto);
    Page<PlayerDto> getAllPlayers(Optional<Integer> page, Optional<String> sortBy,
                                  Optional<String> name, Optional<PlayerStatus> status,
                                  Optional<PlayerRole> role, Optional<Nationality> nationality);
    String deletePlayer(Long playerId);
}