package ma.time.traker.api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import ma.time.traker.api.domain.Person;
import ma.time.traker.api.repository.PersonRepository;
import ma.time.traker.api.service.dto.PersonCreateDTO;
import ma.time.traker.api.service.dto.PersonResponseDTO;
import ma.time.traker.api.service.dto.PersonUpdateDTO;
import ma.time.traker.exception.PersonBusinessException;
import ma.time.traker.exception.PersonNotFoundException;

@ApplicationScoped
@Transactional
public class PersonServiceImpl implements PersonService {

  @Inject
  PersonRepository personRepository;

  @Override
  public List<PersonResponseDTO> getAllPersons() {
    return personRepository.listAll()
        .stream()
        .map(this::toResponseDTO)
        .collect(Collectors.toList());
  }

  @Override
  public PersonResponseDTO getPersonById(Long id) throws PersonNotFoundException {
    if (id == null) {
      throw new IllegalArgumentException("Person ID cannot be null");
    }

    Person person = personRepository.findById(id);
    if (person == null) {
      throw new PersonNotFoundException(id);
    }

    return toResponseDTO(person);
  }

  @Override
  public PersonResponseDTO createPerson(PersonCreateDTO createDTO) throws PersonBusinessException {
    // Validate inputs
    validateCreateInput(createDTO);

    // Business rule: Check for name uniqueness (case-insensitive)
    if (existsByName(createDTO.name())) {
      throw new PersonBusinessException("A person with name '" + createDTO.name() + "' already exists");
    }

    // Business rule: Age validation (additional business constraints)
    validateAgeBusinessRules(createDTO.age());

    // Create new person entity
    Person newPerson = new Person();
    newPerson.name = createDTO.name();
    newPerson.age = createDTO.age();
    newPerson.createdAt = LocalDateTime.now();
    newPerson.updatedAt = LocalDateTime.now();

    // Save through repository
    personRepository.create(newPerson);

    return toResponseDTO(newPerson);
  }

  @Override
  public PersonResponseDTO updatePerson(Long id, PersonUpdateDTO updateDTO)
      throws PersonNotFoundException, PersonBusinessException {

    // Validate inputs
    validateUpdateInput(id, updateDTO);

    // Check if person exists
    Person existingPerson = personRepository.findById(id);
    if (existingPerson == null) {
      throw new PersonNotFoundException(id);
    }

    // Business rule: Name uniqueness check (exclude current person)
    if (updateDTO.name() != null && !updateDTO.name().equals(existingPerson.name)) {
      if (existsByName(updateDTO.name())) {
        throw new PersonBusinessException("A person with name '" + updateDTO.name() + "' already exists");
      }
    }

    // Business rule: Age validation if age is being updated
    if (updateDTO.age() != null) {
      validateAgeBusinessRules(updateDTO.age());
    }

    // Update fields (partial update)
    if (updateDTO.name() != null) {
      existingPerson.name = updateDTO.name();
    }
    if (updateDTO.age() != null) {
      existingPerson.age = updateDTO.age();
    }

    existingPerson.updatedAt = LocalDateTime.now();

    // Update through repository
    personRepository.update(id, existingPerson);

    return toResponseDTO(existingPerson);
  }

  @Override
  public void deletePerson(Long id) throws PersonNotFoundException {
    if (id == null) {
      throw new IllegalArgumentException("Person ID cannot be null");
    }

    // Check if person exists
    Person person = personRepository.findById(id);
    if (person == null) {
      throw new PersonNotFoundException(id);
    }

    // Business rule: Additional validation before deletion
    validateDeletionRules(person);

    boolean deleted = personRepository.delete(id);
    if (!deleted) {
      throw new PersonNotFoundException(id);
    }
  }

  @Override
  public boolean existsByName(String name) {
    if (name == null) {
      return false;
    }
    return personRepository.findByName(name) != null;
  }

  @Override
  public List<PersonResponseDTO> getPersonsWithMinimumAge(Integer minAge) {
    if (minAge == null || minAge < 0) {
      throw new IllegalArgumentException("Minimum age must be non-negative");
    }

    return personRepository.listAll()
        .stream()
        .filter(person -> person.age >= minAge)
        .map(this::toResponseDTO)
        .collect(Collectors.toList());
  }

  @Override
  public PersonStatistics getPersonStatistics() {
    List<Person> allPersons = personRepository.listAll();

    if (allPersons.isEmpty()) {
      return new PersonStatistics(0, 0.0, 0, 0);
    }

    long totalCount = allPersons.size();
    double averageAge = allPersons.stream()
        .mapToInt(person -> person.age)
        .average()
        .orElse(0.0);

    int minAge = allPersons.stream()
        .mapToInt(person -> person.age)
        .min()
        .orElse(0);

    int maxAge = allPersons.stream()
        .mapToInt(person -> person.age)
        .max()
        .orElse(0);

    return new PersonStatistics(totalCount, averageAge, minAge, maxAge);
  }

  @Override
  public List<PersonResponseDTO> searchPersonsByName(String namePattern) {
    if (namePattern == null || namePattern.trim().isEmpty()) {
      return List.of();
    }

    // Case-insensitive name search with word boundary matching
    String lowerPattern = namePattern.toLowerCase().trim();
    return personRepository.listAll()
        .stream()
        .filter(person -> {
          String[] words = person.name.toLowerCase().split("\\s+");
          for (String word : words) {
            if (word.equals(lowerPattern)) {
              return true;
            }
          }
          return false;
        })
        .map(this::toResponseDTO)
        .collect(Collectors.toList());
  }

  // Private helper methods

  private PersonResponseDTO toResponseDTO(Person person) {
    return new PersonResponseDTO(
        person.id,
        person.name,
        person.age,
        person.createdAt,
        person.updatedAt);
  }

  private void validateCreateInput(PersonCreateDTO createDTO) {
    if (createDTO == null) {
      throw new PersonBusinessException("Person creation data cannot be null");
    }

    if (createDTO.name() == null || createDTO.name().trim().isEmpty()) {
      throw new PersonBusinessException("Name is required");
    }

    if (createDTO.age() == null) {
      throw new PersonBusinessException("Age is required");
    }

    // Basic validation first
    if (createDTO.age() < 0) {
      throw new PersonBusinessException("Age must be non-negative");
    }

    if (createDTO.age() > 150) {
      throw new PersonBusinessException("Age must be less than or equal to 150");
    }

    // Business rule validation after basic validation
    validateAgeBusinessRules(createDTO.age());
  }

  private void validateUpdateInput(Long id, PersonUpdateDTO updateDTO) {
    if (id == null) {
      throw new IllegalArgumentException("Person ID cannot be null");
    }

    if (updateDTO == null) {
      throw new PersonBusinessException("Person update data cannot be null");
    }

    // Validate age if provided
    if (updateDTO.age() != null) {
      if (updateDTO.age() < 0) {
        throw new PersonBusinessException("Age must be non-negative");
      }

      if (updateDTO.age() > 150) {
        throw new PersonBusinessException("Age must be less than or equal to 150");
      }
    }
  }

  private void validateAgeBusinessRules(Integer age) {
    // Business rule: Age should be reasonable for a time tracking app
    if (age < 16) {
      throw new PersonBusinessException("Age must be at least 16 for time tracking purposes");
    }

    // Business rule: Age should be reasonable for professional use
    if (age > 100) {
      throw new PersonBusinessException("Age must be less than or equal to 100");
    }
  }

  private void validateDeletionRules(Person person) {
    // Business rule: Cannot delete persons with certain ages (example)
    if (person.age > 90) {
      throw new PersonBusinessException("Cannot delete persons over 90 years old due to compliance rules");
    }

    // Additional business rules can be added here
    // For example: check if person has active time entries, etc.
  }
}
