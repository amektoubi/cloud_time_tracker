package ma.time.traker.api.repository;

import java.time.LocalDateTime;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import ma.time.traker.api.domain.Person;

@ApplicationScoped
public class PersonRepository implements PanacheRepositoryBase<Person, Long> {

  public Person findById(Long id) {
    return getEntityManager().find(Person.class, id);
  }

  public Person findByName(String name) {
    return find("name", name).firstResult();
  }

  @Transactional
  public Person create(Person person) {
    person.createdAt = LocalDateTime.now();
    person.updatedAt = LocalDateTime.now();
    persist(person);
    return person;
  }

  @Transactional
  public boolean delete(Long id) {
    Person person = getEntityManager().find(Person.class, id);
    if (person != null) {
      getEntityManager().remove(person);
      return true;
    }
    return false;
  }

  @Transactional
  public Person update(Long id, Person personUpdates) {
    Person existingPerson = getEntityManager().find(Person.class, id);
    if (existingPerson == null) {
      return null;
    }
    
    existingPerson.name = personUpdates.name;
    existingPerson.age = personUpdates.age;
    existingPerson.updatedAt = LocalDateTime.now();
    
    getEntityManager().merge(existingPerson);
    return existingPerson;
  }
}
