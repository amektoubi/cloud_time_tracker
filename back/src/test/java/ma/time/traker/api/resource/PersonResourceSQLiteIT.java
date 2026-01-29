package ma.time.traker.api.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import ma.time.traker.api.test.profile.SQLiteTestProfile;

@QuarkusTest
@TestProfile(SQLiteTestProfile.class)
public class PersonResourceSQLiteIT extends PersonResourceBaseIT {
  // All CRUD tests from base class will run with SQLite
  // This test suite verifies compatibility with SQLite syntax and behavior
}
