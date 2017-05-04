package com.esir.projetjxsjxw.ServerREST;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.simple.JSONObject;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.core.util.MultivaluedMapImpl;


@Path("/Google")
@SuppressWarnings("unchecked")
public class Google {
	
	private static Client client = Client.create();
	private static final String CLIENT_ID = "927355833541-2sm1rvjbn75e2ai86umn197vfmse5dse.apps.googleusercontent.com";
	private static final String CLIENT_SECRET = "XSlr_yogrmX6VUnOlXx9AUq7";
	private static final String SCOPE = "https://www.googleapis.com/auth/drive";
	private static final String REDIRECT_URI = "http://localhost:8080/ServerREST/myWebService/Google/getCode";
	private static String _code = null;
	private static String _token = null;
		
	
	@GET
	@Path("/connection")
	@Produces(MediaType.APPLICATION_JSON)
	public Response connect() {
		
		MultivaluedMap<String, String> formData = new MultivaluedMapImpl();
		formData.add("client_id", CLIENT_ID);
		formData.add("redirect_uri", REDIRECT_URI);
		formData.add("response_type", "code");
		formData.add("scope", SCOPE);
				
		WebResource webResource = client.resource("https://accounts.google.com/o/oauth2/auth").queryParams(formData);
		
		JSONObject res = new JSONObject();
		res.put("url", webResource.getURI());
		
		return Response.status(200).entity(res).header("Access-Control-Allow-Origin", "*").build();
	}
	
	@GET
	@Path("/getCode")
	public Response getCode(@QueryParam("code") String code) throws JsonParseException, JsonMappingException, IOException {
		_code=code;
		URI location = null;
		try {
			location = new URI("http://localhost:4200");
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
		getToken();
		return Response.temporaryRedirect(location).build();
	}
	
	private void getToken() throws JsonParseException, JsonMappingException, IOException {
		if (_token == null) {

			MultivaluedMap<String, String> formDataToGetToken = new MultivaluedMapImpl();
			formDataToGetToken.add("code", _code);
			formDataToGetToken.add("grant_type", "authorization_code");
			formDataToGetToken.add("client_id", CLIENT_ID);
			formDataToGetToken.add("client_secret", CLIENT_SECRET);
			formDataToGetToken.add("redirect_uri", REDIRECT_URI);

			WebResource webResource = client.resource("https://accounts.google.com/o/oauth2/token");
			String payload = webResource.post(ClientResponse.class, formDataToGetToken).getEntity(String.class);

			_token = (String) new ObjectMapper().readValue(payload, JSONObject.class).get("access_token");

		}
	}
		
	@GET
	@Path("/getFiles")
	public Response getFiles() {
		WebResource webResource = client.resource("https://www.googleapis.com/drive/v2/files");
				
		ClientResponse clientResponse = webResource
			.header("Authorization", "Bearer " + _token)
			.get(ClientResponse.class);
		
		String res = clientResponse.getEntity(String.class);
		return Response.status(200).entity(res).header("Access-Control-Allow-Origin", "*").build();
	}
	
	//TODO : 
	@GET
	@Path("/createFiles")
	@Produces(MediaType.APPLICATION_JSON)
	public Response createFile( @QueryParam("code") String code, 
								@QueryParam("id")   String id, 
								@QueryParam("name") String name,
								@QueryParam("type") String type ) {
									
		
		return null;
		
	}
	
		
}
