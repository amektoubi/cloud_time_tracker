package ma.time.traker.exception;

public class PersonNotFoundException extends RuntimeException {
  public PersonNotFoundException(Long id) {
    super("Person with id " + id + " not found");
  }

  public PersonNotFoundException(String name) {
    super("Person with name '" + name + "' not found");
  }
}
