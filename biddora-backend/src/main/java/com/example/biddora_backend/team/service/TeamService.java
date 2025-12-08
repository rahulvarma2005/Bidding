package com.example.biddora_backend.team.service;

import com.example.biddora_backend.team.dto.CreateTeamDto;
import com.example.biddora_backend.team.entity.Team;
import java.util.List;

public interface TeamService {
    Team createTeam(CreateTeamDto createTeamDto);
    Team getMyTeam();
    Team getTeamById(Long id);
    List<Team> getAllTeams();
}