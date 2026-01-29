package ma.time.traker.api.resource;

import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import ma.time.traker.api.test.profile.PostgreSQLTestProfile;
import ma.time.traker.api.test.ressource.PostgreSQLTestResource;

@QuarkusTest
@TestProfile(PostgreSQLTestProfile.class)
@QuarkusTestResource(value = PostgreSQLTestResource.class, restrictToAnnotatedClass = true)
public class PersonResourcePostgresIT extends PersonResourceBaseIT {
  // All CRUD tests from base class will run with PostgreSQL
  // This test suite verifies compatibility with PostgreSQL syntax and behavior
}
