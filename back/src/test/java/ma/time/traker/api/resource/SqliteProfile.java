package ma.time.traker.api.resource;

import io.quarkus.test.junit.QuarkusTestProfile;

public class SqliteProfile implements QuarkusTestProfile {

  @Override
  public String getConfigProfile() {
    return "it";
  }

}
