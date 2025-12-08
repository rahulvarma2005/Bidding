package com.example.biddora_backend.player.repo;

import com.example.biddora_backend.player.entity.Player;
import com.example.biddora_backend.player.enums.PlayerStatus;
import com.example.biddora_backend.player.enums.PlayerRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface PlayerRepo extends JpaRepository<Player, Long>, JpaSpecificationExecutor<Player> {

    // Search players by name
    Page<Player> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Filter by Status (e.g., show all UNSOLD players)
    Page<Player> findByStatus(PlayerStatus status, Pageable pageable);

    // Filter by Role (e.g., show all BATSMAN)
    Page<Player> findByRole(PlayerRole role, Pageable pageable);

    // Find players belonging to a specific team
    List<Player> findAllBySoldToTeamId(Long teamId);

    // Combined Search + Status
    Page<Player> findByNameContainingIgnoreCaseAndStatus(String name, PlayerStatus status, Pageable pageable);
}