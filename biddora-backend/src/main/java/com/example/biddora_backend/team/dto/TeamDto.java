package com.example.biddora_backend.team.dto;

import com.example.biddora_backend.player.dto.PlayerDto;
import lombok.Data;
import java.util.List;

@Data
public class TeamDto {
    private Long id;
    private String teamName;
    private String acronym;
    private String logoUrl;
    private Long totalPurse;
    private Long remainingPurse;
    private Integer maxSquadSize;
    private Integer maxOverseasPlayers;
    private String ownerUsername; // Only show username, not full User object
    private List<PlayerDto> squad; // Show purchased players
}