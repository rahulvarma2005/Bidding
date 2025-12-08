package com.example.biddora_backend.team.dto;

import lombok.Data;

@Data
public class CreateTeamDto {
    private String teamName;
    private String acronym;
    private String logoUrl;
    private Long totalPurse;
    private String ownerUsername; // We link by username
}