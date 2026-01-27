package ma.time.traker.api.resource;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.Matchers.hasSize;

import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import io.quarkus.test.junit.QuarkusIntegrationTest;
import io.quarkus.test.junit.TestProfile;
import io.restassured.http.ContentType;
import ma.time.traker.api.domain.Person;

@QuarkusIntegrationTest
@TestProfile(SqliteProfile.class)
@TestMethodOrder(OrderAnnotation.class)
public class PersonResourceIT {

  @Test
  @Order(1)
  void testListAllPersons() {
    given()
        .when().get("/persons")
        .then()
        .statusCode(200); // Empty database initially
  }

  @Test
  @Order(2)
  void testGetPersonById_NotFound() {
    given()
        .when().get("/persons/1")
        .then()
        .statusCode(200); // No persons exist yet
  }

  @Test
  @Order(3)
  void testGetPersonById_Success() {
    // First create a person
    Person newPerson = new Person();
    newPerson.name = "Alice Johnson";
    newPerson.age = 25;

    Integer createdId = given()
        .contentType(ContentType.JSON)
        .body(newPerson)
        .when().post("/persons")
        .then()
        .statusCode(201)
        .body("name", equalTo("Alice Johnson"))
        .body("age", equalTo(25))
        .extract()
        .path("id");

    // Now test retrieving that person
    given()
        .when().get("/persons/" + createdId)
        .then()
        .statusCode(200)
        .body("name", equalTo("Alice Johnson"))
        .body("age", equalTo(25))
        .body("id", equalTo(createdId));
  }

  @Test
  @Order(4)
  void testCreatePerson() {
    Person newPerson = new Person();
    newPerson.name = "Alice Johnson";
    newPerson.age = 25;

    given()
        .contentType(ContentType.JSON)
        .body(newPerson)
        .when().post("/persons")
        .then()
        .statusCode(201)
        .body("name", equalTo("Alice Johnson"))
        .body("age", equalTo(25))
        .body("id", notNullValue()) // ID will be auto-generated
        .body("createdAt", notNullValue())
        .body("updatedAt", notNullValue());
  }

  @Test
  @Order(5)
  void testDeletePerson_Success() {
    // First create a person
    Person newPerson = new Person();
    newPerson.name = "Bob Smith";
    newPerson.age = 30;

    Integer createdId = given()
        .contentType(ContentType.JSON)
        .body(newPerson)
        .when().post("/persons")
        .then()
        .statusCode(201)
        .extract()
        .path("id");

    // Now delete the person
    given()
        .when().delete("/persons/" + createdId)
        .then()
        .statusCode(204);

    // Verify person is deleted
    given()
        .when().get("/persons/" + createdId)
        .then()
        .statusCode(404);
  }

  @Test
  @Order(6)
  void testDeletePerson_NotFound() {
    given()
        .when().delete("/persons/999")
        .then()
        .statusCode(404);
  }

}
