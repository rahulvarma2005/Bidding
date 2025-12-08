package com.example.biddora_backend.auction.service.impl;

import com.example.biddora_backend.auction.service.AuctioneerService;
import com.example.biddora_backend.bid.entity.Bid;
import com.example.biddora_backend.bid.repo.BidRepo;
import com.example.biddora_backend.common.exception.BidException;
import com.example.biddora_backend.common.exception.ProductAccessDeniedException;
import com.example.biddora_backend.common.handlers.SocketConnectionHandler;
import com.example.biddora_backend.common.util.EntityFetcher;
import com.example.biddora_backend.player.dto.PlayerDto;
import com.example.biddora_backend.player.entity.Player;
import com.example.biddora_backend.player.enums.PlayerStatus;
import com.example.biddora_backend.player.mapper.PlayerMapper;
import com.example.biddora_backend.player.repo.PlayerRepo;
import com.example.biddora_backend.team.entity.Team;
import com.example.biddora_backend.team.repo.TeamRepo;
import com.example.biddora_backend.user.entity.User;
import com.example.biddora_backend.user.enums.Role;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuctioneerServiceImpl implements AuctioneerService {

    private final PlayerRepo playerRepo;
    private final BidRepo bidRepo;
    private final TeamRepo teamRepo;
    private final PlayerMapper playerMapper;
    private final EntityFetcher entityFetcher;
    private final SocketConnectionHandler socketConnectionHandler; // Inject Socket Handler

    private void checkAdminAccess() {
        User user = entityFetcher.getCurrentUser();
        if (user.getRole() != Role.ADMIN) {
            throw new ProductAccessDeniedException("Only the Auctioneer (Admin) can perform this action.");
        }
    }

    private void broadcastUpdate(String type, PlayerDto playerDto) {
        try {
            // Re-using the sendBidToProduct method logic for generic broadcasts would require
            // a public generic method in SocketConnectionHandler.
            // For now, let's assume we added a generic 'broadcastMessage' method or we use a workaround.
            // Let's assume you added 'broadcastMessage(String type, Object payload)' to SocketHandler as suggested previously.
            // If strictly sticking to previous code, we need to cast or wrap.
            // Assuming the 'broadcastMessage' method I suggested in Phase 3 is present:
            socketConnectionHandler.broadcastMessage(type, playerDto);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    @Transactional
    public PlayerDto bringPlayerToTable(Long playerId) {
        checkAdminAccess();
        Player player = entityFetcher.getPlayerById(playerId);

        if (player.getStatus() == PlayerStatus.SOLD || player.getStatus() == PlayerStatus.ON_AUCTION) {
            throw new BidException("Player is already sold or on the table.");
        }

        player.setStatus(PlayerStatus.ON_AUCTION);
        PlayerDto dto = playerMapper.mapToDto(playerRepo.save(player));

        broadcastUpdate("PLAYER_CHANGED", dto); // WebSocket Trigger
        return dto;
    }

    @Override
    @Transactional
    public PlayerDto sellPlayer(Long playerId) {
        checkAdminAccess();
        Player player = entityFetcher.getPlayerById(playerId);

        if (player.getStatus() != PlayerStatus.ON_AUCTION) {
            throw new BidException("Player is not currently on the auction table.");
        }

        Optional<Bid> winningBidOpt = bidRepo.findTopByPlayerOrderByAmountDesc(player);

        if (winningBidOpt.isEmpty()) {
            throw new BidException("No bids received. Cannot sell player.");
        }

        Bid winningBid = winningBidOpt.get();
        User winner = winningBid.getUser();
        Team team = entityFetcher.getTeamByOwner(winner);

        if (team.getRemainingPurse() < winningBid.getAmount()) {
            throw new BidException("CRITICAL: Winning team does not have enough funds!");
        }

        team.deductPurse(winningBid.getAmount());
        teamRepo.save(team);

        player.setStatus(PlayerStatus.SOLD);
        player.setSoldPrice(winningBid.getAmount());
        player.setSoldToTeam(team);

        PlayerDto dto = playerMapper.mapToDto(playerRepo.save(player));

        broadcastUpdate("PLAYER_SOLD", dto); // WebSocket Trigger
        return dto;
    }

    @Override
    @Transactional
    public PlayerDto markUnsold(Long playerId) {
        checkAdminAccess();
        Player player = entityFetcher.getPlayerById(playerId);

        if (player.getStatus() != PlayerStatus.ON_AUCTION) {
            throw new BidException("Player is not currently on the auction table.");
        }

        player.setStatus(PlayerStatus.UNSOLD);
        PlayerDto dto = playerMapper.mapToDto(playerRepo.save(player));

        broadcastUpdate("PLAYER_UNSOLD", dto); // WebSocket Trigger
        return dto;
    }
}