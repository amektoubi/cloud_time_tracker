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
        "quarkus.hibernate-orm.unsupported-properties.\"hibernate.type.preferred_uuid_jdbc_type\"", "VARCHAR",
        "quarkus.hibernate-orm.log.sql", "false",
        "quarkus.log.category.\"org.flywaydb\".level", "DEBUG");
  }
}
