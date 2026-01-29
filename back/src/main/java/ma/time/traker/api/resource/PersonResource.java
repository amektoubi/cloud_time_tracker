package ma.time.traker.api.resource;

import java.net.URI;
import java.util.List;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import ma.time.traker.api.service.PersonService;
import ma.time.traker.api.service.dto.PersonCreateDTO;
import ma.time.traker.api.service.dto.PersonResponseDTO;
import ma.time.traker.api.service.dto.PersonUpdateDTO;
import ma.time.traker.exception.PersonBusinessException;
import ma.time.traker.exception.PersonNotFoundException;

@Path("/persons")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PersonResource {

  @Inject
  PersonService personService;

  @GET
  public Response getAllPersons() {
    try {
      List<PersonResponseDTO> persons = personService.getAllPersons();
      return Response.ok(persons).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
          .entity("{\"error\": \"Failed to retrieve persons\"}")
          .build();
    }
  }

  @GET
  @Path("/{id}")
  public Response getPersonById(@PathParam("id") Long id) {
    try {
      PersonResponseDTO person = personService.getPersonById(id);
      return Response.ok(person).build();
    } catch (PersonNotFoundException e) {
      return Response.status(Response.Status.NOT_FOUND)
          .entity("{\"error\": \"" + e.getMessage() + "\"}")
          .build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
          .entity("{\"error\": \"Failed to retrieve person\"}")
          .build();
    }
  }

  @POST
  public Response createPerson(PersonCreateDTO personCreateDTO) {
    try {
      PersonResponseDTO createdPerson = personService.createPerson(personCreateDTO);
      return Response.created(URI.create("/persons/" + createdPerson.id()))
          .entity(createdPerson)
          .build();
    } catch (PersonBusinessException e) {
      return Response.status(Response.Status.CONFLICT)
          .entity("{\"error\": \"" + e.getMessage() + "\"}")
          .build();
    } catch (Exception e) {
      return Response.status(Response.Status.BAD_REQUEST)
          .entity("{\"error\": \"Validation failed\", \"details\": \"" + e.getMessage() + "\"}")
          .build();
    }
  }

  @PUT
  @Path("/{id}")
  public Response updatePerson(@PathParam("id") Long id, PersonUpdateDTO personUpdateDTO) {
    try {
      PersonResponseDTO updatedPerson = personService.updatePerson(id, personUpdateDTO);
      return Response.ok(updatedPerson).build();
    } catch (PersonNotFoundException e) {
      return Response.status(Response.Status.NOT_FOUND)
          .entity("{\"error\": \"" + e.getMessage() + "\"}")
          .build();
    } catch (PersonBusinessException e) {
      return Response.status(Response.Status.CONFLICT)
          .entity("{\"error\": \"" + e.getMessage() + "\"}")
          .build();
    } catch (Exception e) {
      return Response.status(Response.Status.BAD_REQUEST)
          .entity("{\"error\": \"Validation failed\", \"details\": \"" + e.getMessage() + "\"}")
          .build();
    }
  }

  @DELETE
  @Path("/{id}")
  public Response deletePerson(@PathParam("id") Long id) {
    try {
      personService.deletePerson(id);
      return Response.noContent().build();
    } catch (PersonNotFoundException e) {
      return Response.status(Response.Status.NOT_FOUND)
          .entity("{\"error\": \"" + e.getMessage() + "\"}")
          .build();
    } catch (PersonBusinessException e) {
      return Response.status(Response.Status.CONFLICT)
          .entity("{\"error\": \"" + e.getMessage() + "\"}")
          .build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
          .entity("{\"error\": \"Failed to delete person\"}")
          .build();
    }
  }

  // Additional endpoints leveraging the service layer

  @GET
  @Path("/stats")
  public Response getPersonStatistics() {
    try {
      PersonService.PersonStatistics stats = personService.getPersonStatistics();
      return Response.ok(stats).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
          .entity("{\"error\": \"Failed to retrieve statistics\"}")
          .build();
    }
  }

  @GET
  @Path("/search/{namePattern}")
  public Response searchPersons(@PathParam("namePattern") String namePattern) {
    try {
      List<PersonResponseDTO> persons = personService.searchPersonsByName(namePattern);
      return Response.ok(persons).build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
          .entity("{\"error\": \"Failed to search persons\"}")
          .build();
    }
  }

  @GET
  @Path("/age/{minAge}")
  public Response getPersonsByMinimumAge(@PathParam("minAge") Integer minAge) {
    try {
      List<PersonResponseDTO> persons = personService.getPersonsWithMinimumAge(minAge);
      return Response.ok(persons).build();
    } catch (IllegalArgumentException e) {
      return Response.status(Response.Status.BAD_REQUEST)
          .entity("{\"error\": \"" + e.getMessage() + "\"}")
          .build();
    } catch (Exception e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
          .entity("{\"error\": \"Failed to retrieve persons by age\"}")
          .build();
    }
  }
}
