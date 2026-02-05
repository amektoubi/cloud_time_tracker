package ma.time.traker.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import ma.time.traker.api.domain.Person;

public record PersonResponseDTO(
    UUID id,
    String name,
    Integer age,
    LocalDateTime createdAt,
    LocalDateTime updatedAt) {
  public static PersonResponseDTO toResponseDTO(Person person) {
    return new PersonResponseDTO(
        person.id,
        person.name,
        person.age,
        person.createdAt,
        person.updatedAt);
  }

}
