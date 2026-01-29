package ma.time.traker.api.service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record PersonCreateDTO(
    @NotBlank(message = "Name is required")
    String name,
    
    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age must be non-negative")
    @Max(value = 150, message = "Age must be less than or equal to 150")
    Integer age
) {}