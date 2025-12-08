package com.example.biddora_backend.team.repo;

import com.example.biddora_backend.team.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TeamRepo extends JpaRepository<Team, Long> {
    Optional<Team> findByOwnerId(Long ownerId);
    boolean existsByTeamName(String teamName);
}