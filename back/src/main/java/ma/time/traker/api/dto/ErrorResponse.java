package ma.time.traker.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Standardized error response DTO for consistent API error handling
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
    String error,
    String details
) {
    
    /**
     * Create error response with only error message
     */
    public static ErrorResponse of(String error) {
        return new ErrorResponse(error, null);
    }
    
    /**
     * Create error response with error message and additional details
     */
    public static ErrorResponse of(String error, String details) {
        return new ErrorResponse(error, details);
    }
}