package com.example.biddora_backend.bid.repo;

import com.example.biddora_backend.bid.entity.Bid;
import com.example.biddora_backend.player.entity.Player;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BidRepo extends JpaRepository<Bid, Long> {
    Optional<Bid> findTopByPlayerOrderByAmountDesc(Player player);
    Page<Bid> findByPlayerIdOrderByAmountDesc(Long playerId, Pageable pageable);
}