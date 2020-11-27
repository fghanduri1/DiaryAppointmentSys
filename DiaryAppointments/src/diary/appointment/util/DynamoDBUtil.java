package diary.appointment.util;

import com.amazonaws.client.builder.*;
import com.amazonaws.client.builder.AwsClientBuilder.*;
import com.amazonaws.services.dynamodbv2.*;
import com.amazonaws.services.dynamodbv2.datamodeling.*;

public class DynamoDBUtil {

	private static AmazonDynamoDB dbClient=null;		
	private static DynamoDBMapper mapper=null;		//a reusable DynamoDBMapper

	
	public static DynamoDBMapper getDBMapper(String region,String endPoint)
	{
	if (DynamoDBUtil.mapper==null)	
		{
		DynamoDBUtil.dbClient=getDynamoDBClient(region,endPoint);	//get DynamoDB client
		DynamoDBUtil.mapper=new DynamoDBMapper(dbClient);	//create DynamoDBMapper object
		}
	return DynamoDBUtil.mapper;
	} //end method

	/**
	 * Return a DynamoDB client.
	 * @return
	 */
	public static AmazonDynamoDB getDynamoDBClient(String region,String endPoint)
	{
	if (DynamoDBUtil.dbClient!=null) {
		//if there is already a client
		return DynamoDBUtil.dbClient;
	}
			//return it

	//otherwise create one
	else {
		
	AmazonDynamoDBClientBuilder builder=AmazonDynamoDBClientBuilder.standard();	//create a client builder
	if (region.equals("local"))
		{
		EndpointConfiguration epConfig=new AwsClientBuilder.EndpointConfiguration(endPoint,region);
		builder.setEndpointConfiguration(epConfig);
		}
	else {
		builder.setRegion(region);	//otherwise set builder to use specified region
	}

	return builder.build();
	}
	//build and return +DynamoDB client
	} //end method
	} //end class
