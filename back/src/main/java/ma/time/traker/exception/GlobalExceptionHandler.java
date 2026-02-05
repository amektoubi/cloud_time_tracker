package ma.time.traker.exception;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import ma.time.traker.api.dto.ErrorResponse;

/**
 * Global exception handler implementing JAX-RS ExceptionMapper
 * Handles all uncaught exceptions and maps them to appropriate HTTP responses
 */
@Provider
public class GlobalExceptionHandler implements ExceptionMapper<Exception> {

    @Override
    public Response toResponse(Exception exception) {
        // Handle specific custom exceptions first (more specific handling)
        if (exception instanceof PersonNotFoundException e) {
            return Response.status(Status.NOT_FOUND)
                .entity(ErrorResponse.of(e.getMessage()))
                .build();
        }
        
        if (exception instanceof PersonBusinessException e) {
            return Response.status(Status.CONFLICT)
                .entity(ErrorResponse.of(e.getMessage()))
                .build();
        }
        
        if (exception instanceof PersonValidationException e) {
            return Response.status(Status.BAD_REQUEST)
                .entity(ErrorResponse.of("Validation failed", e.getMessage()))
                .build();
        }
        
        // Handle validation exceptions from Jakarta Bean Validation
        if (exception instanceof jakarta.validation.ConstraintViolationException e) {
            String message = "Validation failed: " + e.getConstraintViolations().stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .reduce((a, b) -> a + "; " + b)
                .orElse("Unknown validation error");
                
            return Response.status(Status.BAD_REQUEST)
                .entity(ErrorResponse.of("Validation failed", message))
                .build();
        }
        
        // Handle IllegalArgumentException (often used for validation)
        if (exception instanceof IllegalArgumentException e) {
            return Response.status(Status.BAD_REQUEST)
                .entity(ErrorResponse.of("Invalid request", e.getMessage()))
                .build();
        }
        
        // Fallback for unexpected errors (generic exception)
        // In production, you might want to log these and return a generic message
        String errorMessage = exception.getMessage() != null && !exception.getMessage().isEmpty() 
            ? "Internal Server Error: " + exception.getMessage()
            : "Internal Server Error";
            
        return Response.status(Status.INTERNAL_SERVER_ERROR)
            .entity(ErrorResponse.of(errorMessage))
            .build();
    }
}