package com.credibanco.cardsystem.service;

import com.credibanco.cardsystem.model.AuditLog;
import com.credibanco.cardsystem.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void logAction(String action, String entity, String entityIdentifier, String description) {
        AuditLog auditLog = AuditLog.builder()
                .action(action)
                .entity(entity)
                .entityIdentifier(entityIdentifier)
                .description(description)
                .build();
        
        auditLogRepository.save(auditLog);
    }
}