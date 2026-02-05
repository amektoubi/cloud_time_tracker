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
        .body("size()", is(2)); // Should have 2 test users
  }

  @Test
  @Order(2)
  void testGetPersonById_NotFound() {
    given()
        .when().get("/persons/00000000-0000-0000-0000-000000000000")
        .then()
        .statusCode(404);
  }

  @Test
  @Order(3)
  void testGetPersonById_Success() {
    // Test retrieving existing test user
    given()
        .when().get("/persons/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
        .then()
        .statusCode(200)
        .body("name", equalTo("John Doe"))
        .body("age", equalTo(30))
        .body("id", equalTo("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"));
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
        .when().put("/persons/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
        .then()
        .statusCode(200)
        .body("name", equalTo("Updated Test User 1"))
        .body("age", equalTo(26))
        .body("id", equalTo("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"))
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
        .when().put("/persons/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99")
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

    String createdId = given()
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
        .when().delete("/persons/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99")
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
        .body("size()", greaterThanOrEqualTo(2)); // At least original 2 test users
  }

  // Bean Validation Tests - These test the controller layer with @Valid
  @Test
  @Order(11)
  void testCreatePerson_NullName_ShouldReturn400() {
    given()
        .contentType(ContentType.JSON)
        .body("{\"name\": null, \"age\": 25}")
        .when().post("/persons")
        .then()
        .statusCode(400)
        .body("parameterViolations[0].message", org.hamcrest.Matchers.containsString("Name is required"));
  }

  @Test
  @Order(12)
  void testCreatePerson_EmptyName_ShouldReturn400() {
    given()
        .contentType(ContentType.JSON)
        .body("{\"name\": \"\", \"age\": 25}")
        .when().post("/persons")
        .then()
        .statusCode(400)
        .body("parameterViolations[0].message", org.hamcrest.Matchers.containsString("Name is required"));
  }

  @Test
  @Order(13)
  void testCreatePerson_NullAge_ShouldReturn400() {
    given()
        .contentType(ContentType.JSON)
        .body("{\"name\": \"Test User\", \"age\": null}")
        .when().post("/persons")
        .then()
        .statusCode(400)
        .body("parameterViolations[0].message", org.hamcrest.Matchers.containsString("Age is required"));
  }

  @Test
  @Order(14)
  void testCreatePerson_NegativeAge_ShouldReturn400() {
    given()
        .contentType(ContentType.JSON)
        .body("{\"name\": \"Test User\", \"age\": -5}")
        .when().post("/persons")
        .then()
        .statusCode(400)
        .body("parameterViolations[0].message", org.hamcrest.Matchers.containsString("Age must be non-negative"));
  }

  @Test
  @Order(15)
  void testUpdatePerson_NullName_ShouldReturn400() {
    given()
        .contentType(ContentType.JSON)
        .body("{\"name\": null, \"age\": 25}")
        .when().put("/persons/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
        .then()
        .statusCode(400)
        .body("parameterViolations[0].message", org.hamcrest.Matchers.containsString("Name is required"));
  }

  @Test
  @Order(16)
  void testUpdatePerson_EmptyName_ShouldReturn400() {
    given()
        .contentType(ContentType.JSON)
        .body("{\"name\": \"\", \"age\": 25}")
        .when().put("/persons/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
        .then()
        .statusCode(400)
        .body("parameterViolations[0].message", org.hamcrest.Matchers.containsString("Name is required"));
  }

  @Test
  @Order(17)
  void testUpdatePerson_NullAge_ShouldReturn400() {
    given()
        .contentType(ContentType.JSON)
        .body("{\"name\": \"Updated User\", \"age\": null}")
        .when().put("/persons/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
        .then()
        .statusCode(400)
        .body("parameterViolations[0].message", org.hamcrest.Matchers.containsString("Age is required"));
  }

  @Test
  @Order(18)
  void testUpdatePerson_NegativeAge_ShouldReturn400() {
    given()
        .contentType(ContentType.JSON)
        .body("{\"name\": \"Updated User\", \"age\": -10}")
        .when().put("/persons/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
        .then()
        .statusCode(400)
        .body("parameterViolations[0].message", org.hamcrest.Matchers.containsString("Age must be non-negative"));
  }
}
