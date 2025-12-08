package com.example.biddora_backend.team.controller;

import com.example.biddora_backend.common.util.EntityFetcher;
import com.example.biddora_backend.team.dto.CreateTeamDto;
import com.example.biddora_backend.team.dto.TeamDto;
import com.example.biddora_backend.team.mapper.TeamMapper;
import com.example.biddora_backend.team.service.TeamService;
import com.example.biddora_backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;
    private final TeamMapper teamMapper;
    private final EntityFetcher entityFetcher;

    @GetMapping("/my-team")
    public ResponseEntity<TeamDto> getMyTeam() {
        User user = entityFetcher.getCurrentUser();
        // Since we are using EntityFetcher in Controller for convenience to get ID,
        // ideally logic should be in Service, but this is fine for now.
        return ResponseEntity.ok(teamMapper.mapToDto(entityFetcher.getTeamByOwner(user)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamDto> getTeamById(@PathVariable Long id) {
        return ResponseEntity.ok(teamMapper.mapToDto(teamService.getTeamById(id)));
    }

    @GetMapping
    public ResponseEntity<List<TeamDto>> getAllTeams() {
        List<TeamDto> teams = teamService.getAllTeams().stream()
                .map(teamMapper::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(teams);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TeamDto> createTeam(@RequestBody CreateTeamDto createTeamDto) {
        return ResponseEntity.ok(teamMapper.mapToDto(teamService.createTeam(createTeamDto)));
    }
}