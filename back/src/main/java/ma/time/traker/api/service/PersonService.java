package ma.time.traker.api.service;

import java.util.List;
import java.util.UUID;

import ma.time.traker.api.dto.PersonDTO;
import ma.time.traker.api.dto.PersonResponseDTO;
import ma.time.traker.exception.PersonBusinessException;
import ma.time.traker.exception.PersonNotFoundException;

public interface PersonService {

  /**
   * Get all persons
   * 
   * @return List of all persons
   */
  List<PersonResponseDTO> getAllPersons();

  /**
   * Get person by ID
   * 
   * @param id Person ID
   * @return Person response DTO
   * @throws PersonNotFoundException if person not found
   */
  PersonResponseDTO getPersonById(UUID id) throws PersonNotFoundException;

  /**
   * Create a new person
   * 
   * @param createDTO Person creation data
   * @return Created person response
   * @throws PersonBusinessException if business rules violated
   */
  PersonResponseDTO createPerson(PersonDTO createDTO) throws PersonBusinessException;

  /**
   * Update an existing person
   * 
   * @param id        Person ID
   * @param updateDTO Update data
   * @return Updated person response
   * @throws PersonNotFoundException if person not found
   * @throws PersonBusinessException if business rules violated
   */
  PersonResponseDTO updatePerson(UUID id, PersonDTO updateDTO)
      throws PersonNotFoundException, PersonBusinessException;

  /**
   * Delete a person by ID
   * 
   * @param id Person ID
   * @throws PersonNotFoundException if person not found
   */
  void deletePerson(UUID id) throws PersonNotFoundException;

  /**
   * Check if person exists by name
   * 
   * @param name Person name
   * @return true if exists, false otherwise
   */
  boolean existsByName(String name);

  /**
   * Get persons with minimum age
   * 
   * @param minAge Minimum age
   * @return List of persons meeting criteria
   */
  List<PersonResponseDTO> getPersonsWithMinimumAge(Integer minAge);

  /**
   * Get persons statistics
   * 
   * @return Person statistics (count, average age, etc.)
   */
  PersonStatistics getPersonStatistics();

  /**
   * Search persons by name pattern
   * 
   * @param namePattern Name search pattern
   * @return List of matching persons
   */
  List<PersonResponseDTO> searchPersonsByName(String namePattern);

  /**
   * Record for person statistics
   */
  record PersonStatistics(
      long totalCount,
      double averageAge,
      int minAge,
      int maxAge) {
  }


}
