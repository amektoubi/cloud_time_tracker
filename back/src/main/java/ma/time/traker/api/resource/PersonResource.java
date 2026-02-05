package ma.time.traker.api.resource;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
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
import ma.time.traker.api.dto.PersonDTO;
import ma.time.traker.api.dto.PersonResponseDTO;
import ma.time.traker.api.service.PersonService;

@Path("/persons")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PersonResource {

  @Inject
  PersonService personService;

  @GET
  public Response getAllPersons() {
    List<PersonResponseDTO> persons = personService.getAllPersons();
    return Response.ok(persons).build();
  }

  @GET
  @Path("/{id}")
  public Response getPersonById(@PathParam("id") UUID id) {
    PersonResponseDTO person = personService.getPersonById(id);
    return Response.ok(person).build();
  }

  @POST
  public Response createPerson(@Valid PersonDTO personCreateDTO) {
    PersonResponseDTO createdPerson = personService.createPerson(personCreateDTO);
    return Response.created(URI.create("/persons/" + createdPerson.id()))
        .entity(createdPerson)
        .build();
  }

  @PUT
  @Path("/{id}")
  public Response updatePerson(@PathParam("id") UUID id, @Valid PersonDTO personUpdateDTO) {
    PersonResponseDTO updatedPerson = personService.updatePerson(id, personUpdateDTO);
    return Response.ok(updatedPerson).build();
  }

  @DELETE
  @Path("/{id}")
  public Response deletePerson(@PathParam("id") UUID id) {
    personService.deletePerson(id);
    return Response.noContent().build();
  }

  // Additional endpoints leveraging the service layer

  @GET
  @Path("/stats")
  public Response getPersonStatistics() {
    PersonService.PersonStatistics stats = personService.getPersonStatistics();
    return Response.ok(stats).build();
  }

  @GET
  @Path("/search/{namePattern}")
  public Response searchPersons(@PathParam("namePattern") String namePattern) {
    List<PersonResponseDTO> persons = personService.searchPersonsByName(namePattern);
    return Response.ok(persons).build();
  }

  @GET
  @Path("/age/{minAge}")
  public Response getPersonsByMinimumAge(@PathParam("minAge") Integer minAge) {
    List<PersonResponseDTO> persons = personService.getPersonsWithMinimumAge(minAge);
    return Response.ok(persons).build();
  }
}