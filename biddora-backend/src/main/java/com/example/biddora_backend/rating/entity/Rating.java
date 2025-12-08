package com.example.biddora_backend.rating.entity;

import com.example.biddora_backend.player.entity.Player;
import com.example.biddora_backend.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "ratings")
public class Rating {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    private String comment;
    private Integer ratingStars;
    private LocalDateTime ratingDate;
}