package ma.time.traker.api.test.profile;

import java.util.Map;

import io.quarkus.test.junit.QuarkusTestProfile;

public class PostgreSQLTestProfile implements QuarkusTestProfile {

  @Override
  public Map<String, String> getConfigOverrides() {
    // PostgreSQL configuration for test using standard ports
    return Map.of(
        "quarkus.datasource.db-kind", "postgresql",
        "quarkus.datasource.jdbc.max-size", "16",
        "quarkus.flyway.migrate-at-start", "true",
        "quarkus.flyway.locations", "db/test_data/postgresql",
        "quarkus.hibernate-orm.unsupported-properties.\"hibernate.type.preferred_uuid_jdbc_type\"", "UUID",
        "quarkus.hibernate-orm.log.sql", "false",
        "quarkus.log.category.\"org.flywaydb\".level", "DEBUG");
  }
}
