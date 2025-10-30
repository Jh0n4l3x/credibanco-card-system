package com.credibanco.cardsystem.repository;

import com.credibanco.cardsystem.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    Optional<Card> findByIdentifier(String identifier);
    boolean existsByPan(String pan);
}