package ma.time.traker.api.resource;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.is;

import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import io.restassured.http.ContentType;
import ma.time.traker.api.domain.Person;

@TestMethodOrder(OrderAnnotation.class)
public abstract class PersonResourceBaseIT {

  @Test
  @Order(1)
  void testListAllPersons() {
    given()
        .when().get("/persons")
        .then()
        .statusCode(200)
        .body("size()", is(3)); // Should have 3 test users
  }

  @Test
  @Order(2)
  void testGetPersonById_NotFound() {
    given()
        .when().get("/persons/999")
        .then()
        .statusCode(404);
  }

  @Test
  @Order(3)
  void testGetPersonById_Success() {
    // Test retrieving existing test user
    given()
        .when().get("/persons/1")
        .then()
        .statusCode(200)
        .body("name", equalTo("Test User 1"))
        .body("age", equalTo(25))
        .body("id", equalTo(1));
  }

  @Test
  @Order(4)
  void testCreatePerson() {
    // Create a new person
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
  void testCreatePerson_WithExistingId() {
    // Test creating person with predefined data
    Person newPerson = new Person();
    newPerson.name = "Bob Smith";
    newPerson.age = 30;

    given()
        .contentType(ContentType.JSON)
        .body(newPerson)
        .when().post("/persons")
        .then()
        .statusCode(201)
        .body("name", equalTo("Bob Smith"))
        .body("age", equalTo(30))
        .body("id", notNullValue());
  }

  @Test
  @Order(6)
  void testUpdatePerson() {
    // Update existing test user
    Person updatedPerson = new Person();
    updatedPerson.name = "Updated Test User 1";
    updatedPerson.age = 26;

    given()
        .contentType(ContentType.JSON)
        .body(updatedPerson)
        .when().put("/persons/1")
        .then()
        .statusCode(200)
        .body("name", equalTo("Updated Test User 1"))
        .body("age", equalTo(26))
        .body("id", equalTo(1))
        .body("updatedAt", notNullValue());
  }

  @Test
  @Order(7)
  void testUpdatePerson_NotFound() {
    Person updatedPerson = new Person();
    updatedPerson.name = "Non-existent User";
    updatedPerson.age = 40;

    given()
        .contentType(ContentType.JSON)
        .body(updatedPerson)
        .when().put("/persons/999")
        .then()
        .statusCode(404);
  }

  @Test
  @Order(8)
  void testDeletePerson_Success() {
    // First create a person to delete
    Person newPerson = new Person();
    newPerson.name = "Temporary User";
    newPerson.age = 25;

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
  @Order(9)
  void testDeletePerson_NotFound() {
    given()
        .when().delete("/persons/999")
        .then()
        .statusCode(404);
  }

  @Test
  @Order(10)
  void testListPersons_AfterModifications() {
    given()
        .when().get("/persons")
        .then()
        .statusCode(200)
        .body("size()", greaterThanOrEqualTo(3)); // At least original 3 test users
  }
}
