package com.example.biddora_backend.bid.service.impl;

import com.example.biddora_backend.bid.dto.BidDto;
import com.example.biddora_backend.bid.dto.CreateBidDto;
import com.example.biddora_backend.bid.entity.Bid;
import com.example.biddora_backend.common.exception.BidAccessDeniedException;
import com.example.biddora_backend.common.exception.BidException;
import com.example.biddora_backend.player.entity.Player;
import com.example.biddora_backend.player.enums.Nationality;
import com.example.biddora_backend.player.enums.PlayerStatus;
import com.example.biddora_backend.team.entity.Team;
import com.example.biddora_backend.user.entity.User;
import com.example.biddora_backend.common.handlers.SocketConnectionHandler;
import com.example.biddora_backend.bid.mapper.BidMapper;
import com.example.biddora_backend.bid.repo.BidRepo;
import com.example.biddora_backend.bid.service.BidService;
import com.example.biddora_backend.common.util.EntityFetcher;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BidServiceImpl implements BidService {

    private final BidRepo bidRepo;
    private final BidMapper bidMapper;
    private final EntityFetcher entityFetcher;
    private final SocketConnectionHandler socketConnectionHandler;

    // Default limits used if team-specific limits are not set
    private static final int DEFAULT_MAX_SQUAD_SIZE = 25;
    private static final int DEFAULT_MAX_OVERSEAS_PLAYERS = 8;

    @Override
    @Transactional
    public BidDto placeBid(CreateBidDto createBidDto) {

        Player player = entityFetcher.getPlayerById(createBidDto.getPlayerId());
        User user = entityFetcher.getCurrentUser();
        Team team = entityFetcher.getTeamByOwner(user); // Bidder MUST have a team

        // 1. Check if Player is actually on the auction table
        if (player.getStatus() != PlayerStatus.ON_AUCTION) {
            throw new BidException("This player is not currently on the auction table.");
        }

        // 2. Validate Bid Amount vs Current Highest
        Optional<Bid> highestBidOpt = bidRepo.findTopByPlayerOrderByAmountDesc(player);
        Long currentHighest = highestBidOpt.map(Bid::getAmount).orElse(player.getBasePrice());

        if (highestBidOpt.isEmpty()) {
            // Case 1: No bids yet. The first bid must be at least the base price.
            if (createBidDto.getAmount() < player.getBasePrice()) {
                throw new BidException("Bid cannot be lower than the base price: " + player.getBasePrice());
            }
        } else {
            // Case 2: Bids exist. The new bid must be strictly higher than the current highest.
            if (createBidDto.getAmount() <= currentHighest) {
                throw new BidException("Bid must be higher than the current highest bid: " + currentHighest);
            }
        }

        // 3. RULE: Check Team Wallet (Purse)
        if (team.getRemainingPurse() < createBidDto.getAmount()) {
            throw new BidAccessDeniedException("Insufficient funds! Your remaining purse is: " + team.getRemainingPurse());
        }

        // 4. RULE: Check Squad Size Limit (team-specific, with sensible default)
        int maxSquadSize = team.getMaxSquadSize() != null ? team.getMaxSquadSize() : DEFAULT_MAX_SQUAD_SIZE;
        if (team.getSquad().size() >= maxSquadSize) {
            throw new BidAccessDeniedException("Squad full! You cannot buy more than " + maxSquadSize + " players.");
        }

        // 5. RULE: Check Overseas Limit (team-specific, with sensible default)
        if (player.getNationality() == Nationality.OVERSEAS) {
            long currentOverseasCount = team.getSquad().stream()
                    .filter(p -> p.getNationality() == Nationality.OVERSEAS)
                    .count();

            int maxOverseasPlayers = team.getMaxOverseasPlayers() != null ? team.getMaxOverseasPlayers() : DEFAULT_MAX_OVERSEAS_PLAYERS;
            if (currentOverseasCount >= maxOverseasPlayers) {
                throw new BidAccessDeniedException("Foreign quota full! You cannot have more than " + maxOverseasPlayers + " overseas players.");
            }
        }

        // Place the Bid
        Bid bid = new Bid();
        bid.setAmount(createBidDto.getAmount());
        bid.setUser(user);
        bid.setPlayer(player);
        bid.setTimestamp(LocalDateTime.now());

        Bid savedBid = bidRepo.save(bid);
        BidDto mappedBid = bidMapper.mapToDto(savedBid);

        // Broadcast to all clients
        try {
            socketConnectionHandler.sendBidToProduct(mappedBid);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return mappedBid;
    }

    @Override
    public Page<BidDto> getBidsByProductId(Long playerId, Optional<Integer> page){
        // Note: keeping method name same for interface compatibility, but logic is for Player

        PageRequest pageRequest = PageRequest.of(page.orElse(0), 12);
        Page<Bid> bids = bidRepo.findByPlayerIdOrderByAmountDesc(playerId, pageRequest);

        return bids.map(bidMapper::mapToDto);
    }
}