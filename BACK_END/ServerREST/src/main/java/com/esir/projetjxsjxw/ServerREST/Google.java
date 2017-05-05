package com.esir.projetjxsjxw.ServerREST;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
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
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.core.util.MultivaluedMapImpl;
import com.sun.jersey.multipart.FormDataMultiPart;
import com.sun.jersey.multipart.FormDataParam;
import com.sun.jersey.multipart.MultiPart;


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
	@Produces(MediaType.APPLICATION_JSON)
	public Response getFiles() throws JSONException {
		WebResource webResource = client.resource("https://www.googleapis.com/drive/v2/files?maxResults=1000");
				
		ClientResponse clientResponse = webResource
			.header("Authorization", "Bearer " + _token)
			.get(ClientResponse.class);
		
		org.codehaus.jettison.json.JSONObject res = new org.codehaus.jettison.json.JSONObject(clientResponse.getEntity(String.class));
		return Response.status(200).entity(res.get("items")).header("Access-Control-Allow-Origin", "*").build();
	}
	
	
	@GET
	@Path("/getStorage")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getStorage() throws JSONException {
		
		WebResource webResource = client.resource("https://www.googleapis.com/drive/v2/about");
				
		ClientResponse clientResponse = webResource
			.header("Authorization", "Bearer " + _token)
			.get(ClientResponse.class);
		
		org.codehaus.jettison.json.JSONObject payload = new org.codehaus.jettison.json.JSONObject(clientResponse.getEntity(String.class));
		
		org.codehaus.jettison.json.JSONObject res = new org.codehaus.jettison.json.JSONObject();
		res.put("quotaBytesTotal", payload.get("quotaBytesTotal"));
		res.put("quotaBytesUsed", payload.get("quotaBytesUsed"));
		
		return Response.status(200).entity(res).header("Access-Control-Allow-Origin", "*").build();
	}
	
	
	@GET
	@Path("/createFiles")
	@Produces(MediaType.APPLICATION_JSON)
	public Response createFile( @QueryParam("title")    String title,
								@QueryParam("idFolder") String idFolder) throws JsonGenerationException, JsonMappingException, IOException {
								
		
		WebResource webResource = client.resource("https://www.googleapis.com/upload/drive/v2/files");
		
	    ParentWithId parentToAdd = new ParentWithId();
		parentToAdd.setId(idFolder);
		parentToAdd.setIsRoot(true);
		ArrayList<ParentWithId> parents = new ArrayList<ParentWithId>();
		parents.add(parentToAdd);
		
		Map<String, Object> fileMetaMap = new HashMap<String, Object>();
		fileMetaMap.put("title", title);
		fileMetaMap.put("description", "upload depuis notre drive <3");
		fileMetaMap.put("mimeType", "Text/plain");
		fileMetaMap.put("parents[]", parents);
		
		String fileMeta = new ObjectMapper().writeValueAsString(fileMetaMap);
		
		System.out.println(fileMeta);
		
		@SuppressWarnings("resource")
		MultiPart multipart = new FormDataMultiPart().field("metadata", fileMeta, MediaType.APPLICATION_JSON_TYPE);
		multipart.setMediaType(MediaType.MULTIPART_FORM_DATA_TYPE);
		
		ClientResponse clientResponse = webResource
				.header("Authorization", "Bearer " + _token)
				.header("uploadType", "multipart")
				.type(MediaType.MULTIPART_FORM_DATA_TYPE)
				.post(ClientResponse.class, multipart);
		
		String res = clientResponse.getEntity(String.class);
		
		return Response.status(200).entity(res).header("Access-Control-Allow-Origin", "*").build();
				
	}
	
	@POST
	@Path("/uploadFiles")
	@Consumes({MediaType.MULTIPART_FORM_DATA})
	public Response uploadFile ( @FormDataParam("file") InputStream uploadedInputStream,
								 @FormDataParam("file") FormDataContentDisposition fileDetail,
								 @QueryParam("title") String title,
								 @QueryParam("idFolder") String idFolder ) throws JsonGenerationException, JsonMappingException, IOException {
		
		writeToFile(uploadedInputStream, fileDetail.getFileName());
		
		WebResource webResource = client.resource("https://www.googleapis.com/upload/drive/v2/files");
		
	    Parents parentToAdd = new Parents();
		parentToAdd.setId(idFolder);
		ArrayList<Parents> parents = new ArrayList<Parents>();
		parents.add(parentToAdd);
		
		Map<String, Object> fileMetaMap = new HashMap<String, Object>();
		fileMetaMap.put("title", title);
		fileMetaMap.put("description", "upload depuis notre drive <3");
		fileMetaMap.put("mimeType", "Text/plain");
		fileMetaMap.put("parents[]", parents);
		
		File fileToUpload = new File(fileDetail.getFileName());
		
		String fileMeta = new ObjectMapper().writeValueAsString(fileMetaMap);
		
		System.out.println(fileMeta);
		
		@SuppressWarnings("resource")
		MultiPart multipart = new FormDataMultiPart().field("metadata", fileMeta, MediaType.APPLICATION_JSON_TYPE);
		multipart.setMediaType(MediaType.MULTIPART_FORM_DATA_TYPE);
		
		ClientResponse clientResponse = webResource
				.header("Authorization", "Bearer " + _token)
				.header("uploadType", "multipart")
				.type(MediaType.APPLICATION_OCTET_STREAM_TYPE)
				.entity(fileToUpload, MediaType.APPLICATION_OCTET_STREAM)
				.post(ClientResponse.class, multipart);
		
		String res = clientResponse.getEntity(String.class);
		
		return Response.status(200).entity(res).header("Access-Control-Allow-Origin", "*").build();
	}
	
	@GET
	@Path("/delete")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteFile( @QueryParam("id") String id) {
		
		MultivaluedMap<String, String> formData = new MultivaluedMapImpl();
		formData.add("scope", SCOPE);
		
		WebResource webResource = client.resource("https://www.googleapis.com/drive/v2/files/" + id).queryParams(formData);
		
		ClientResponse clientResponse = webResource
				.header("Authorization", "Bearer " + _token)
				.delete(ClientResponse.class);
		
		String res = clientResponse.getEntity(String.class);
		System.out.println(res);		
		return Response.status(204).entity(res).header("Access-Control-Allow-Origin", "*").build();
	}
	
	/*@GET
	@Path("/copy")
	@Produces*/
	
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
