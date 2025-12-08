package com.example.biddora_backend.common.util;

import com.example.biddora_backend.player.entity.Player;
import com.example.biddora_backend.player.repo.PlayerRepo;
import com.example.biddora_backend.rating.entity.Rating;
import com.example.biddora_backend.rating.repo.RatingRepo;
import com.example.biddora_backend.team.entity.Team;
import com.example.biddora_backend.team.repo.TeamRepo;
import com.example.biddora_backend.user.entity.User;
import com.example.biddora_backend.common.exception.UserNotFoundException;
import com.example.biddora_backend.common.exception.ResourceNotFoundException;
import com.example.biddora_backend.user.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EntityFetcher {

    private final UserRepo userRepo;
    private final PlayerRepo playerRepo;
    private final RatingRepo ratingRepo;
    private final TeamRepo teamRepo;

    public User getUserById(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found."));
    }

    public User findUserByUsername(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found."));
    }

    public User getCurrentUser(){
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        return findUserByUsername(currentUsername);
    }

    public boolean existsByUsername(String username){
        return userRepo.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepo.existsByEmail(email);
    }

    public Player getPlayerById(Long playerId){
        return playerRepo.findById(playerId)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + playerId));
    }

    public Rating getRatingById(Long ratingId) {
        return ratingRepo.getRatingById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found."));
    }

    public Team getTeamByOwner(User owner) {
        return teamRepo.findByOwnerId(owner.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found for user: " + owner.getUsername()));
    }
}