package ma.time.traker.api.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import ma.time.traker.api.domain.Person;
import ma.time.traker.api.dto.PersonDTO;
import ma.time.traker.api.dto.PersonResponseDTO;
import ma.time.traker.api.repository.PersonRepository;
import ma.time.traker.exception.PersonBusinessException;
import ma.time.traker.exception.PersonNotFoundException;

@ExtendWith(MockitoExtension.class)
class PersonServiceSimpleTest {

  @Mock
  PersonRepository personRepository;

  @InjectMocks
  PersonServiceImpl personService;

  @Captor
  ArgumentCaptor<Person> personCaptor;

  private Person testPerson1;
  private Person testPerson2;
  private Person testPerson3;

  @BeforeEach
  void setUp() {
    // Setup test data
    testPerson1 = new Person();
    testPerson1.id = UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
    testPerson1.name = "John Doe";
    testPerson1.age = 25;
    testPerson1.createdAt = LocalDateTime.now();
    testPerson1.updatedAt = LocalDateTime.now();

    testPerson2 = new Person();
    testPerson2.id = UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12");
    testPerson2.name = "Jane Smith";
    testPerson2.age = 30;
    testPerson2.createdAt = LocalDateTime.now();
    testPerson2.updatedAt = LocalDateTime.now();

    testPerson3 = new Person();
    testPerson3.id = UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14");
    testPerson3.name = "Bob Johnson";
    testPerson3.age = 20;
    testPerson3.createdAt = LocalDateTime.now();
    testPerson3.updatedAt = LocalDateTime.now();
  }

  @Test
  void getAllPersons_ShouldReturnAllPersons() {
    // Given
    List<Person> persons = Arrays.asList(testPerson1, testPerson2, testPerson3);
    when(personRepository.listAll()).thenReturn(persons);

    // When
    List<PersonResponseDTO> result = personService.getAllPersons();

    // Then
    assertEquals(3, result.size());
    verify(personRepository).listAll();
  }

  @Test
  void getAllPersons_EmptyList_ShouldReturnEmptyList() {
    // Given
    when(personRepository.listAll()).thenReturn(Arrays.asList());

    // When
    List<PersonResponseDTO> result = personService.getAllPersons();

    // Then
    assertEquals(0, result.size());
    verify(personRepository).listAll();
  }

  @Test
  void getPersonById_ExistingId_ShouldReturnPerson() {
    // Given
    UUID testId = testPerson1.id;
    when(personRepository.findById(testId)).thenReturn(testPerson1);

    // When
    PersonResponseDTO result = personService.getPersonById(testId);

    // Then
    assertNotNull(result);
    assertEquals(testId, result.id());
    assertEquals("John Doe", result.name());
    assertEquals(25, result.age());
    verify(personRepository).findById(testId);
  }

  @Test
  void getPersonById_NonExistingId_ShouldThrowException() {
    // Given
    UUID nonExistingId = UUID.fromString("00000000-0000-0000-0000-000000000000");
    when(personRepository.findById(nonExistingId)).thenReturn(null);

    // When & Then
    assertThrows(PersonNotFoundException.class, () -> {
      personService.getPersonById(nonExistingId);
    });
    verify(personRepository).findById(nonExistingId);
  }

  @Test
  void getPersonById_NullId_ShouldThrowIllegalArgumentException() {
    // When & Then
    assertThrows(IllegalArgumentException.class, () -> {
      personService.getPersonById(null);
    });
    verify(personRepository, never()).findById(any());
  }

  @Test
  void createPerson_ValidData_ShouldCreateAndReturnPerson() {
    // Given
    PersonDTO createDTO = new PersonDTO("Alice Cooper", 35);
    when(personRepository.findByName("Alice Cooper")).thenReturn(null);

    Person newPerson = new Person();
    newPerson.id = UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14");
    newPerson.name = "Alice Cooper";
    newPerson.age = 35;
    newPerson.createdAt = LocalDateTime.now();
    newPerson.updatedAt = LocalDateTime.now();

    when(personRepository.create(any(Person.class))).thenReturn(newPerson);

    // When
    PersonResponseDTO result = personService.createPerson(createDTO);

    // Then
    assertNotNull(result);
    assertEquals("Alice Cooper", result.name());
    assertEquals(35, result.age());
    assertNotNull(result.createdAt());
    assertNotNull(result.updatedAt());
    verify(personRepository).findByName("Alice Cooper");
    verify(personRepository).create(personCaptor.capture());

    Person capturedPerson = personCaptor.getValue();
    assertEquals("Alice Cooper", capturedPerson.name);
    assertEquals(35, capturedPerson.age);
  }

  @Test
  void createPerson_DuplicateName_ShouldThrowBusinessException() {
    // Given
    PersonDTO createDTO = new PersonDTO("John Doe", 25);
    when(personRepository.findByName("John Doe")).thenReturn(testPerson1);

    // When & Then
    assertThrows(PersonBusinessException.class, () -> {
      personService.createPerson(createDTO);
    });
    verify(personRepository).findByName("John Doe");
    verify(personRepository, never()).create(any(Person.class));
  }

  @Test
  void existsByName_ExistingName_ShouldReturnTrue() {
    // Given
    when(personRepository.findByName("John Doe")).thenReturn(testPerson1);

    // When
    boolean result = personService.existsByName("John Doe");

    // Then
    assertTrue(result);
    verify(personRepository).findByName("John Doe");
  }

  @Test
  void existsByName_NonExistingName_ShouldReturnFalse() {
    // Given
    when(personRepository.findByName("Unknown Person")).thenReturn(null);

    // When
    boolean result = personService.existsByName("Unknown Person");

    // Then
    assertFalse(result);
    verify(personRepository).findByName("Unknown Person");
  }

  @Test
  void existsByName_NullName_ShouldReturnFalse() {
    // When
    boolean result = personService.existsByName(null);

    // Then
    assertFalse(result);
    verify(personRepository, never()).findByName(any());
  }

  @Test
  void getPersonsWithMinimumAge_ValidMinAge_ShouldReturnFilteredPersons() {
    // Given
    List<Person> allPersons = Arrays.asList(testPerson1, testPerson2, testPerson3);
    when(personRepository.listAll()).thenReturn(allPersons);

    // When
    List<PersonResponseDTO> result = personService.getPersonsWithMinimumAge(25);

    // Then
    assertEquals(2, result.size()); // John Doe (25) and Jane Smith (30)
    verify(personRepository).listAll();
  }

  @Test
  void getPersonsWithMinimumAge_InvalidMinAge_ShouldThrowIllegalArgumentException() {
    // When & Then
    assertThrows(IllegalArgumentException.class, () -> {
      personService.getPersonsWithMinimumAge(-1);
    });
    verify(personRepository, never()).listAll();
  }

  @Test
  void getPersonStatistics_WithPersons_ShouldReturnStatistics() {
    // Given
    List<Person> persons = Arrays.asList(testPerson1, testPerson2, testPerson3);
    when(personRepository.listAll()).thenReturn(persons);

    // When
    PersonService.PersonStatistics result = personService.getPersonStatistics();

    // Then
    assertEquals(3, result.totalCount());
    assertEquals(25.0, result.averageAge(), 0.01);
    assertEquals(20, result.minAge());
    assertEquals(30, result.maxAge());
    verify(personRepository).listAll();
  }

  @Test
  void getPersonStatistics_EmptyList_ShouldReturnEmptyStatistics() {
    // Given
    when(personRepository.listAll()).thenReturn(Arrays.asList());

    // When
    PersonService.PersonStatistics result = personService.getPersonStatistics();

    // Then
    assertEquals(0, result.totalCount());
    assertEquals(0.0, result.averageAge(), 0.01);
    assertEquals(0, result.minAge());
    assertEquals(0, result.maxAge());
    verify(personRepository).listAll();
  }

  @Test
  void searchPersonsByName_ValidPattern_ShouldReturnMatchingPersons() {
    // Given
    List<Person> allPersons = Arrays.asList(testPerson1, testPerson2, testPerson3);
    when(personRepository.listAll()).thenReturn(allPersons);

    // When
    List<PersonResponseDTO> result = personService.searchPersonsByName("John");

    // Then
    assertEquals(1, result.size());
    assertEquals("John Doe", result.get(0).name());
    verify(personRepository).listAll();
  }

  @Test
  void searchPersonsByName_EmptyPattern_ShouldReturnEmptyList() {
    // When
    List<PersonResponseDTO> result = personService.searchPersonsByName("");

    // Then
    assertEquals(0, result.size());
    verify(personRepository, never()).listAll();
  }

  @Test
  void searchPersonsByName_NullPattern_ShouldReturnEmptyList() {
    // When
    List<PersonResponseDTO> result = personService.searchPersonsByName(null);

    // Then
    assertEquals(0, result.size());
    verify(personRepository, never()).listAll();
  }

  @Test
  void searchPersonsByName_CaseInsensitive_ShouldReturnMatchingPersons() {
    // Given
    List<Person> allPersons = Arrays.asList(testPerson1, testPerson2, testPerson3);
    when(personRepository.listAll()).thenReturn(allPersons);

    // When
    List<PersonResponseDTO> result = personService.searchPersonsByName("john");

    // Then
    assertEquals(1, result.size());
    assertEquals("John Doe", result.get(0).name());
    verify(personRepository).listAll();
  }
}
