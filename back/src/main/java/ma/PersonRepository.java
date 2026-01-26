package ma;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class PersonRepository implements PanacheRepositoryBase<Person, Long> {

    public List<Person> listAll() {
        return listAllPersons();
    }

    @SuppressWarnings("unchecked")
    private List<Person> listAllPersons() {
        return getEntityManager()
            .createQuery("SELECT p FROM Person p", Person.class)
            .getResultList();
    }

    public Person findById(Long id) {
        return findById(id);
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
        Person person = findById(id);
        if (person != null) {
            delete(person);
            return true;
        }
        return false;
    }
}
