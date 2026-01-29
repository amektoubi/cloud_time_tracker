package ma.time.traker.api.test.profile;

import io.quarkus.test.junit.QuarkusTestProfile;

import java.util.Map;

public class SQLiteTestProfile implements QuarkusTestProfile {

  @Override
  public Map<String, String> getConfigOverrides() {
    return Map.of(
        "quarkus.datasource.db-kind", "sqlite",
        "quarkus.datasource.jdbc.url", "jdbc:sqlite::memory:",
        "quarkus.flyway.migrate-at-start", "true",
        "quarkus.flyway.locations", "db/test_data/sqlite",
        "quarkus.log.category.\"org.flywaydb\".level", "DEBUG");
  }
}
