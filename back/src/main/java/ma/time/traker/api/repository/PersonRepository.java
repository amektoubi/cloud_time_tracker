package ma.time.traker.api.repository;

import java.time.LocalDateTime;
import java.util.List;

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
}
