package com.example.biddora_backend.team.service.impl;

import com.example.biddora_backend.common.exception.ResourceAlreadyExistsException;
import com.example.biddora_backend.common.util.EntityFetcher;
import com.example.biddora_backend.team.dto.CreateTeamDto;
import com.example.biddora_backend.team.entity.Team;
import com.example.biddora_backend.team.repo.TeamRepo;
import com.example.biddora_backend.team.service.TeamService;
import com.example.biddora_backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepo teamRepo;
    private final EntityFetcher entityFetcher;

    @Override
    @Transactional
    public Team createTeam(CreateTeamDto dto) {
        if (teamRepo.existsByTeamName(dto.getTeamName())) {
            throw new ResourceAlreadyExistsException("Team name already exists");
        }

        User owner = entityFetcher.findUserByUsername(dto.getOwnerUsername());

        // Check if user already owns a team
        if (teamRepo.findByOwnerId(owner.getId()).isPresent()) {
            throw new ResourceAlreadyExistsException("User already owns a team");
        }

        Team team = new Team();
        team.setTeamName(dto.getTeamName());
        team.setAcronym(dto.getAcronym());
        team.setLogoUrl(dto.getLogoUrl());
        team.setTotalPurse(dto.getTotalPurse());
        team.setRemainingPurse(dto.getTotalPurse());
        team.setMaxSquadSize(dto.getMaxSquadSize());
        team.setMaxOverseasPlayers(dto.getMaxOverseasPlayers());
        team.setOwner(owner);

        return teamRepo.save(team);
    }

    @Override
    public Team getMyTeam() {
        User user = entityFetcher.getCurrentUser();
        return entityFetcher.getTeamByOwner(user);
    }

    @Override
    public Team getTeamById(Long id) {
        return teamRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));
    }

    @Override
    public List<Team> getAllTeams() {
        return teamRepo.findAll();
    }
}