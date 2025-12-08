package com.example.biddora_backend.player.repo;

import com.example.biddora_backend.player.entity.Player;
import com.example.biddora_backend.player.enums.Nationality;
import com.example.biddora_backend.player.enums.PlayerRole;
import com.example.biddora_backend.player.enums.PlayerStatus;
import org.springframework.data.jpa.domain.Specification;

public class PlayerSpecification {

    public static Specification<Player> hasName(String name) {
        return (root, query, cb) ->
            name == null ? null : cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Player> hasRole(PlayerRole role) {
        return (root, query, cb) ->
            role == null ? null : cb.equal(root.get("role"), role);
    }

    public static Specification<Player> hasNationality(Nationality nationality) {
        return (root, query, cb) ->
            nationality == null ? null : cb.equal(root.get("nationality"), nationality);
    }

    public static Specification<Player> hasStatus(PlayerStatus status) {
        return (root, query, cb) ->
            status == null ? null : cb.equal(root.get("status"), status);
    }
}

