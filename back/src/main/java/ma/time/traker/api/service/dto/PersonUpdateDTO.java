package ma.time.traker.api.service.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record PersonUpdateDTO(
    String name,
    
    @Min(value = 0, message = "Age must be non-negative")
    @Max(value = 150, message = "Age must be less than or equal to 150")
    Integer age
) {}