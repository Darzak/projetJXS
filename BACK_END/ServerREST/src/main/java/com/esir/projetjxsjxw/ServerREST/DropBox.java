package com.esir.projetjxsjxw.ServerREST;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jettison.json.JSONException;
import org.json.simple.JSONObject;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.UniformInterfaceException;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.core.util.MultivaluedMapImpl;
import com.sun.jersey.multipart.FormDataParam;

@SuppressWarnings("unchecked")
@Path("/DropBox")
public class DropBox {
	
	private static Client client = Client.create();
	private static final String APP_SECRET = "20639kgnd1ptrvt";
	private static final String APP_KEY = "dcye7rd3rthjeum";
	private static final String REDIRECT_URI = "http://localhost:8080/ServerREST/myWebService/DropBox/getCode";
	private static String _code = null;
	private static String token = null;
	
	
	
	@GET
	@Path("/connection")
	@Produces(MediaType.APPLICATION_JSON)
	public Response connect() {
		
		MultivaluedMap<String, String> formData = new MultivaluedMapImpl();
		formData.add("response_type", "code");
		formData.add("client_id", APP_KEY);
		formData.add("redirect_uri", REDIRECT_URI);
		
		JSONObject resSucces = new JSONObject();
		JSONObject resError  = new JSONObject();
		resError.put("error", "internal error");
		
		WebResource webResource = client.resource("https://www.dropbox.com/1/oauth2/authorize").queryParams(formData);
		if ( webResource.get(ClientResponse.class).getStatus() == 200 ) {
			resSucces.put("url", webResource.getURI());
			return Response.status(200).entity(resSucces).header("Access-Control-Allow-Origin", "*").build();
		}
		else {
			return Response.status(500).entity(resError).header("Access-Control-Allow-Origin", "*").build();
		}
		
		
	}
	
	@GET
	@Path("/getCode")
	public Response getCode(
			@QueryParam("code") String code) throws JsonParseException, JsonMappingException, ClientHandlerException, UniformInterfaceException, JSONException, IOException {
		URI location = null;
		_code = code;
		try {
			location = new URI("http://localhost:4200");
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
		getToken();
		return Response.temporaryRedirect(location).build();
	}
	
	private void getToken() throws ClientHandlerException, UniformInterfaceException, JSONException, JsonParseException, JsonMappingException, IOException {
		if (token == null) {
			
			MultivaluedMap<String, String> formDataToGetToken = new MultivaluedMapImpl();
			formDataToGetToken.add("code", _code);
			formDataToGetToken.add("grant_type", "authorization_code");
			formDataToGetToken.add("client_id", APP_KEY);
			formDataToGetToken.add("client_secret", APP_SECRET);
			formDataToGetToken.add("redirect_uri", REDIRECT_URI);
			
			WebResource webResource = client.resource("https://api.dropboxapi.com/oauth2/token").queryParams(formDataToGetToken);
			String payload = webResource.post(ClientResponse.class).getEntity(String.class);
			
			token = (String) new ObjectMapper().readValue(payload, JSONObject.class).get("access_token");
			
		}
	}
	
	@GET
	@Path("/getFiles")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getFiles(@QueryParam("path") String path) throws JsonGenerationException, JsonMappingException, IOException {
		
		Map<String, Object> formDataToGetFiles = new HashMap<String, Object>();
		formDataToGetFiles.put("path", path);
		
		WebResource webResource = client.resource("https://api.dropboxapi.com/2/files/list_folder");
		
		String payload = new ObjectMapper().writeValueAsString(formDataToGetFiles);
		
		ClientResponse clientResponse = webResource
			.type(MediaType.APPLICATION_FORM_URLENCODED)
			.header("Authorization", "Bearer " + token)
			.header("Content-type", "application/json")
			.entity(payload, MediaType.APPLICATION_JSON)
			.post(ClientResponse.class);
		
		String res = clientResponse.getEntity(String.class);
		
		return Response.status(200).entity(res).header("Access-Control-Allow-Origin", "*").build();
	}
	
	@GET
	@Path("/createFiles")
	@Produces(MediaType.APPLICATION_JSON)
	public Response createFiles(@QueryParam("path") String path) throws JsonGenerationException, JsonMappingException, IOException {
		
		WebResource webResource = client.resource("https://content.dropboxapi.com/2/files/upload");
		
		System.out.println(path);
		
		Map<String, Object> formDataToCreateFile = new HashMap<String, Object>();
		formDataToCreateFile.put("path", path);
		formDataToCreateFile.put("autorename", true);
		formDataToCreateFile.put("mute", false);
		formDataToCreateFile.put("mode", "add");
		
		File fileToUpload = new File("empty_file");
		fileToUpload.createNewFile();
		
		String headerArgs = new ObjectMapper().writeValueAsString(formDataToCreateFile);
				
		ClientResponse clientResponse =
				webResource
				.header("Authorization", "Bearer " + token)
				.header("Dropbox-API-Arg", headerArgs)
				.type(MediaType.APPLICATION_OCTET_STREAM_TYPE)
				.entity(fileToUpload, MediaType.APPLICATION_OCTET_STREAM_TYPE)
				.post(ClientResponse.class);
		
		String res = clientResponse.getEntity(String.class);
				
		return Response.status(200).entity(res).header("Access-Control-Allow-Origin", "*").build();
	}
	
	@GET
	@Path("/rename")
	@Produces(MediaType.APPLICATION_JSON)
	public Response renameFile( @QueryParam("input_path") String input_path,
								@QueryParam("new_path")   String new_path ) throws JsonGenerationException, JsonMappingException, IOException {
		
		WebResource webResource = client.resource("https://api.dropboxapi.com/2/files/move");
				
		Map<String, Object> formDataToChangeName = new HashMap<String, Object>();
		formDataToChangeName.put("from_path", input_path);
		formDataToChangeName.put("autorename", true);
		formDataToChangeName.put("allow_shared_folder", false);
		formDataToChangeName.put("to_path", new_path);
		
		String headerArgs = new ObjectMapper().writeValueAsString(formDataToChangeName);
		
		ClientResponse clientResponse =
				webResource
				.header("Authorization", "Bearer " + token)
				.header("Content-Type", "application/json")
				.type(MediaType.APPLICATION_JSON_TYPE)
				.entity(headerArgs, MediaType.APPLICATION_JSON)
				.post(ClientResponse.class);
		
		String res = clientResponse.getEntity(String.class);
				
		return Response.status(200).entity(res).header("Access-Control-Allow-Origin", "*").build();
	}
	
	@POST
	@Path("/uploadFiles")
	@Consumes({MediaType.MULTIPART_FORM_DATA})
	public Response uploadFile ( @FormDataParam("file") InputStream uploadedInputStream,
								 @FormDataParam("file") FormDataContentDisposition fileDetail,
								 @QueryParam("path")    String path ) throws Exception {
	
		System.out.println(uploadedInputStream);
		System.out.println(fileDetail);
		System.out.println(path);
		writeToFile(uploadedInputStream, fileDetail.getFileName());
		
		WebResource webResource = client.resource("https://content.dropboxapi.com/2/files/upload");
		
		Map<String, Object> formDataToUploadFile = new HashMap<String, Object>();
		formDataToUploadFile.put("path", path);
		formDataToUploadFile.put("autorename", true);
		formDataToUploadFile.put("mute", false);
		formDataToUploadFile.put("mode", "add");
		
		File fileToUpload = new File(fileDetail.getFileName());
		
		String headerArgs = new ObjectMapper().writeValueAsString(formDataToUploadFile);
		
		System.out.println(headerArgs);
				
		ClientResponse clientResponse =
				webResource
				.header("Authorization", "Bearer " + token)
				.header("Dropbox-API-Arg", headerArgs)
				.type(MediaType.APPLICATION_OCTET_STREAM_TYPE)
				.entity(fileToUpload, MediaType.APPLICATION_OCTET_STREAM_TYPE)
				.post(ClientResponse.class);
		
		String res = clientResponse.getEntity(String.class);
		
		System.out.println(res);
						
		return Response.status(200).entity(res).header("Access-Control-Allow-Origin", "*").build();
	}
	
	
	private void writeToFile(InputStream uploadedInputStream,
			String uploadedFileLocation) {

		try {
			OutputStream out = new FileOutputStream(new File(
					uploadedFileLocation));
			int read = 0;
			byte[] bytes = new byte[1024];

			out = new FileOutputStream(new File(uploadedFileLocation));
			while ((read = uploadedInputStream.read(bytes)) != -1) {
				out.write(bytes, 0, read);
			}
			out.flush();
			out.close();
		} catch (IOException e) {

			e.printStackTrace();
		}

	}
	

	
}
