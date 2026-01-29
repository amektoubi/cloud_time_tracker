package ma.time.traker.api.test.ressource;

import java.util.HashMap;
import java.util.Map;

import org.testcontainers.containers.PostgreSQLContainer;

import io.quarkus.test.common.QuarkusTestResourceLifecycleManager;

public class PostgreSQLTestResource implements QuarkusTestResourceLifecycleManager {

  PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

  @Override
  public Map<String, String> start() {
    postgres.start();

    Map<String, String> conf = new HashMap<>();
    conf.put("quarkus.datasource.jdbc.url", postgres.getJdbcUrl());
    conf.put("quarkus.datasource.username", postgres.getUsername());
    conf.put("quarkus.datasource.password", postgres.getPassword());

    return conf;
  }

  @Override
  public void stop() {
    postgres.stop();
  }
}
