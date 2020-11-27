package diary.appointment.resource;

import java.util.*;
//import java.awt.PageAttributes.MediaType;

import javax.ws.rs.*;
import javax.ws.rs.core.*;


import com.amazonaws.services.dynamodbv2.datamodeling.*;

import diary.appointment.config.*;
import diary.appointment.model.*;
import diary.appointment.util.*;

@SuppressWarnings("serial")

@Path("/appointments")
public class AppointmenetResource {
	
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	public Response addAppointment(@FormParam("owner") String owner,
			@FormParam("dateTime") long dateTime,
			@FormParam("duration") int duration,
			@FormParam("description") String description){
		
		System.out.println("THIS IS A POST METHOD");
		System.out.println(owner);
		System.out.println(dateTime);
		System.out.println(duration);
		System.out.println(description);

	try	{
		//
		// You should:
		//
		// *** 1. Annotate method to handle POST requests.
		// *** 2. Set response content-type to plain-text (i.e. MediaType.TEXT_PLAIN).
		// *** 3. Inject submitted HTML form parameters into method.
		// *** 4. Use submitted parameters to create a City object.
		//        See cm4108.lab05.city.model.City class API doc on its constructor.
		// *** 5. Use DynamoDBMapper to persist City object into DynamoDB.
		//        See cm4108.aws.util.DynamoDBUtil class API doc on how
		//        to create a DynamoDBMapper object.

		
// ------------------------------SAVING AN APPOINTMENT
		Appointment appointment = new Appointment(null, owner, dateTime, duration, description);
		
		System.out.println("appointment object made");
		
		DynamoDBMapper mapper=DynamoDBUtil.getDBMapper(Config.REGION, Config.LOCAL_ENDPOINT);
		mapper.save(appointment);
		
		//System.out.println("Dynamo stuff made");
		return Response.status(201).entity("Appointment saved").build();
	} catch (Exception e)
		{
		//System.out.println("404 ERROR");
			return Response.status(400).entity("Appointment in saving appointment").build();
		}
	} //end method
	

	/*	@Path("/{id}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Appointment getOneAppointment(@PathParam("id") String id)
	{
		DynamoDBMapper mapper=DynamoDBUtil.getDBMapper(Config.REGION,Config.LOCAL_ENDPOINT);
		Appointment appointment=mapper.load(Appointment.class,id);

		if (appointment==null)
			throw new WebApplicationException(404);

		return appointment;
} //end method */
	
	
	
	
//---------------RETRIEVE ALL APPOINTMENTS----------------------	
	
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Iterable<Appointment> retrieveAllAppointments()
	{
	//
	// You should:
	//
	// *** 1. Annotate method to handle GET request.
	// *** 2. Use annotation to set response content-type to MediaType.APPLICATION_JSON.
	// *** 3. Create a DynamoDBMapper object.
	// *** 4. Create a DynamoDBScanExpression object.
//		      See lecture 5, slide 49.
	// *** 5. Use DynamoDBMapper and DynamoDBScanExpression to scan and get all cities as a Iterable/List.
	// *** 6. Return the Iterable/List. Jackson will do the conversion to JSON.
	//
		
	DynamoDBMapper mapper=DynamoDBUtil.getDBMapper(Config.REGION,Config.LOCAL_ENDPOINT);
	DynamoDBScanExpression scanExpression=new DynamoDBScanExpression();
	List<Appointment> appointment=mapper.scan(Appointment.class,scanExpression);
	return appointment;	//***This should be replaced by your code.
	} //end method

	
	
	
	
//---------------SHOW ALL APPOINTMENTS---------------------	
	
	
	@GET
	@Path("/search/start={start}&end={end}&owner={owner}")
	@Produces(MediaType.APPLICATION_JSON)
	public Iterable<Appointment> showAllAppointmentss(@PathParam("start") long start, @PathParam("end") long end, @PathParam("owner") String owner){
	
		DynamoDBMapper mapper=DynamoDBUtil.getDBMapper(Config.REGION,Config.LOCAL_ENDPOINT);
		DynamoDBScanExpression scanExpression=new DynamoDBScanExpression();
		
		System.out.println("iterable appointment");
		List<Appointment> listAppointment = mapper.scan(Appointment.class, scanExpression);
		List<Appointment> searchDates = new ArrayList <Appointment>();
					
		System.out.println("iterable appointments halfway");
		
		for(Appointment z : listAppointment) {
			if (z.getDateTime() >= start && z.getDateTime() <= end  ) {
				System.out.println("found");
				if(z.getOwner().equals(owner)) {
					searchDates.add(z);
					System.out.println("ADDED");
					
				}
			}
		}
		return searchDates;
	}
	
	
//-----------------------DELETE APPOINTMENT--------------------
	@DELETE
	@Path("/delete/id={id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteOneAppointment(@PathParam("id") UUID id)
	{
	DynamoDBMapper mapper=DynamoDBUtil.getDBMapper(Config.REGION,Config.LOCAL_ENDPOINT);
	Appointment appointment=mapper.load(Appointment.class,id);

	if (appointment==null)
		throw new WebApplicationException(404);

	mapper.delete(appointment);
	return Response.status(200).entity("deleted").build();
	} //end method
	
	
	
	
	
//----------------UPDATE ALL APPOINTMENTS-------------	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/updates")
	public Response updateAppointment(@FormParam("id") UUID id, 
			@FormParam("dateTime") long dateTime,
			@FormParam("duration") int duration, 
			@FormParam("description") String description,
			@FormParam("owner")String owner)	
		{
		
		System.out.println("THIS IS A GET METHOD FOR UPDATEAPPOINTMENT");
		System.out.println(id);

	try {
			
			DynamoDBMapper mapper = DynamoDBUtil.getDBMapper(Config.REGION, Config.LOCAL_ENDPOINT);
			
			Appointment updateAppMapper = mapper.load(Appointment.class, id);
			
			if(updateAppMapper == null) {
				return Response.status(204).entity("Appointment not found").build();
			}else {
				Appointment updateApp = mapper.load(Appointment.class, id);
				updateApp.setDateTime(dateTime);
				updateApp.setDescription(description);
				updateApp.setDuration(duration);
				updateApp.setOwner(owner);
				
				updateApp.toString();
				
				mapper.save(updateApp);
			}
			
			return Response.status(200).entity("Your Appointment has been changed").build();
			
		}catch(Exception e){
			System.out.println("FAILURE 400");

			//return 400 if the try fails
			return Response.status(400)
					.entity("Error in updateAppointment: Parameters wrong")
					.build();
			
		}			
		}
} 

	
