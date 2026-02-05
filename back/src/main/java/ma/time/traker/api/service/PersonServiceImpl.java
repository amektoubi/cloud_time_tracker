package ma.time.traker.api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import ma.time.traker.api.domain.Person;
import ma.time.traker.api.dto.PersonDTO;
import ma.time.traker.api.dto.PersonResponseDTO;
import ma.time.traker.api.repository.PersonRepository;
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
        .map(PersonResponseDTO::toResponseDTO)
        .collect(Collectors.toList());
  }

  @Override
  public PersonResponseDTO getPersonById(UUID id) throws PersonNotFoundException {
    if (id == null) {
      throw new IllegalArgumentException("Person ID cannot be null");
    }

    Person person = personRepository.findById(id);
    if (person == null) {
      throw new PersonNotFoundException(id);
    }

    return PersonResponseDTO.toResponseDTO(person);
  }

  @Override
  public PersonResponseDTO createPerson(PersonDTO createDTO) throws PersonBusinessException {
    if (existsByName(createDTO.name())) {
      throw new PersonBusinessException("A person with name '" + createDTO.name() + "' already exists");
    }

    // Create new person entity
    Person newPerson = new Person();
    newPerson.id = UUID.randomUUID();
    newPerson.name = createDTO.name();
    newPerson.age = createDTO.age();

    // Save through repository
    Person savedPerson = personRepository.create(newPerson);

    return PersonResponseDTO.toResponseDTO(savedPerson);
  }

  @Override
  public PersonResponseDTO updatePerson(UUID id, PersonDTO updateDTO)
      throws PersonNotFoundException, PersonBusinessException {

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

    return PersonResponseDTO.toResponseDTO(existingPerson);
  }

  @Override
  public void deletePerson(UUID id) throws PersonNotFoundException {
    if (id == null) {
      throw new IllegalArgumentException("Person ID cannot be null");
    }

    // Check if person exists
    Person person = personRepository.findById(id);
    if (person == null) {
      throw new PersonNotFoundException(id);
    }

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
        .map(PersonResponseDTO::toResponseDTO)
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
        .map(PersonResponseDTO::toResponseDTO)
        .collect(Collectors.toList());
  }

}

//
