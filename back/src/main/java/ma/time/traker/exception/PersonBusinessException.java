package ma.time.traker.exception;

public class PersonBusinessException extends RuntimeException {
    public PersonBusinessException(String message) {
        super(message);
    }
    
    public PersonBusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}
