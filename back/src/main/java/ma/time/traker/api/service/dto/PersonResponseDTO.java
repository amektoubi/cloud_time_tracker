package ma.time.traker.api.service.dto;

import java.time.LocalDateTime;

public record PersonResponseDTO(
    Long id,
    String name,
    Integer age,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}