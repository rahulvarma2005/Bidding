package com.example.biddora_backend.player.service.impl;

import com.example.biddora_backend.bid.repo.BidRepo;
import com.example.biddora_backend.common.exception.ProductAccessDeniedException;
import com.example.biddora_backend.common.util.EntityFetcher;
import com.example.biddora_backend.player.dto.CreatePlayerDto;
import com.example.biddora_backend.player.dto.PlayerDto;
import com.example.biddora_backend.player.dto.UpdatePlayerDto;
import com.example.biddora_backend.player.entity.Player;
import com.example.biddora_backend.player.enums.Nationality;
import com.example.biddora_backend.player.enums.PlayerRole;
import com.example.biddora_backend.player.enums.PlayerStatus;
import com.example.biddora_backend.player.mapper.PlayerMapper;
import com.example.biddora_backend.player.repo.PlayerRepo;
import com.example.biddora_backend.player.repo.PlayerSpecification;
import com.example.biddora_backend.player.service.PlayerService;
import com.example.biddora_backend.user.entity.User;
import com.example.biddora_backend.user.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlayerServiceImpl implements PlayerService {

    private final PlayerRepo playerRepo;
    private final PlayerMapper playerMapper;
    private final EntityFetcher entityFetcher;
    private final BidRepo bidRepo;

    @Override
    @Transactional
    public PlayerDto addPlayer(CreatePlayerDto dto) {
        User currentUser = entityFetcher.getCurrentUser();

        // Only ADMIN can add players to the auction pool
        if (currentUser.getRole() != Role.ADMIN) {
            throw new ProductAccessDeniedException("Only Admins can add players to the auction.");
        }

        Player player = new Player();
        player.setName(dto.getName());
        player.setNationality(dto.getNationality());
        player.setRole(dto.getRole());
        player.setBasePrice(dto.getBasePrice());
        player.setStats(dto.getStats());
        player.setImageUrl(dto.getImageUrl());
        player.setStatus(PlayerStatus.UPCOMING); // Default status

        return playerMapper.mapToDto(playerRepo.save(player));
    }

    @Override
    public PlayerDto getPlayerById(Long playerId) {
        // You will update EntityFetcher in the next step to support getPlayerById
        // For now, using repo directly or you can add the method to EntityFetcher
        return playerMapper.mapToDto(playerRepo.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found")));
    }

    @Override
    public Page<PlayerDto> getAllPlayers(Optional<Integer> page, Optional<String> sortBy,
                                        Optional<String> name, Optional<PlayerStatus> status,
                                        Optional<PlayerRole> role, Optional<Nationality> nationality) {
        PageRequest pageRequest = PageRequest.of(
                page.orElse(0),
                12,
                Sort.by(sortBy.orElse("basePrice")).ascending()
        );

        // Build dynamic query using Specifications
        Specification<Player> spec = Specification.where(PlayerSpecification.hasName(name.orElse(null)));
        spec = spec.and(PlayerSpecification.hasStatus(status.orElse(null)));
        spec = spec.and(PlayerSpecification.hasRole(role.orElse(null)));
        spec = spec.and(PlayerSpecification.hasNationality(nationality.orElse(null)));

        return playerRepo.findAll(spec, pageRequest).map(playerMapper::mapToDto);
    }

    @Override
    @Transactional
    public PlayerDto updatePlayer(Long playerId, UpdatePlayerDto dto) {
        User currentUser = entityFetcher.getCurrentUser();
        if (currentUser.getRole() != Role.ADMIN) {
            throw new ProductAccessDeniedException("Only Admins can update players.");
        }

        Player player = playerRepo.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found"));

        if (dto.getName() != null) {
            player.setName(dto.getName());
        }
        if (dto.getNationality() != null) {
            player.setNationality(dto.getNationality());
        }
        if (dto.getRole() != null) {
            player.setRole(dto.getRole());
        }
        if (dto.getBasePrice() != null) {
            player.setBasePrice(dto.getBasePrice());
        }
        if (dto.getStats() != null) {
            player.setStats(dto.getStats());
        }
        if (dto.getImageUrl() != null) {
            player.setImageUrl(dto.getImageUrl());
        }
        if (dto.getStatus() != null) {
            player.setStatus(dto.getStatus());
        }

        return playerMapper.mapToDto(playerRepo.save(player));
    }

    @Override
    @Transactional
    public String deletePlayer(Long playerId) {
        User currentUser = entityFetcher.getCurrentUser();
        if (currentUser.getRole() != Role.ADMIN) {
            throw new ProductAccessDeniedException("Only Admins can delete players.");
        }
        
        // Delete all bids associated with this player first
        bidRepo.deleteByPlayerId(playerId);
        
        playerRepo.deleteById(playerId);
        return "Player deleted successfully";
    }
}