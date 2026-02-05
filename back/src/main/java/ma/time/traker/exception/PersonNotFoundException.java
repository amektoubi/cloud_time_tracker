package ma.time.traker.exception;

import java.util.UUID;

public class PersonNotFoundException extends RuntimeException {
  public PersonNotFoundException(UUID id) {
    super("Person with id " + id + " not found");
  }

  public PersonNotFoundException(String name) {
    super("Person with name '" + name + "' not found");
  }
}
