package com.esir.projetjxsjxw.ServerREST;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.Properties;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.simple.JSONObject;

@Path("/Google")
public class Google {
		
	String googleConfigFile = "#--------OAuth2.0 Client Configuration--------- \n" +
			"scope=https://www.googleapis.com/auth/drive\n"+
			"#state=\n"+
			"grant_type=authorization_code\n"+
			"#username=\n"+
			"#password=\n"+
			"client_id=927355833541-2sm1rvjbn75e2ai86umn197vfmse5dse.apps.googleusercontent.com\n"+
			"client_secret=XSlr_yogrmX6VUnOlXx9AUq7\n"+
			"#access_token=\n"+
			"refresh_token=\n"+
			"approval_prompt_key=approval_prompt\n"+
			"approval_prompt_value=auto\n"+
			"access_type_key=access_type\n"+
			"access_type_value=offline\n"+
			"redirect_uri=http://localhost:4200\n"+
			"authentication_server_url=https://accounts.google.com/o/oauth2/auth\n"+
			"token_endpoint_url=https://accounts.google.com/o/oauth2/token\n"+
			"resource_server_url=https://www.googleapis.com/drive/v2/about\n"+
			"#------------------------------------------------";

	@SuppressWarnings("unchecked")
	@GET
	@Path("/connection")
	@Produces(MediaType.APPLICATION_JSON)
	public Response connect() {
		InputStream is;
		String URLtoSend = null;
		try {
			is = new ByteArrayInputStream(googleConfigFile.getBytes("UTF-8"));
			Properties config = new Properties();
			config.load(is);
			GoogleClient googleClient = new GoogleClient(config);
			URLtoSend = googleClient.getAuthorizationCodeURL();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		JSONObject res = new JSONObject();
		res.put("url", URLtoSend);
		return Response.status(200).header("Access-Control-Allow-Origin", "*").entity(res.toJSONString()).build();
	}
	
	
	@SuppressWarnings("unchecked")
	@GET
	@Path("/file/getFolder")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getFilesFolder(@QueryParam("code") String code, @QueryParam("id") String id) {
		InputStream is;
		try {
			is = new ByteArrayInputStream(googleConfigFile.getBytes("UTF-8"));
			Properties config = new Properties();
			config.load(is);
			GoogleClient googleClientWithCode = new GoogleClient(config);
			googleClientWithCode.setAccessCode(code);
			String accessToken = googleClientWithCode.getAccessToken().get("access_token");
			googleClientWithCode.getOAuth2Details().setAccessToken(accessToken);
			//TODO : si temps faire pagination avec token page
			googleClientWithCode.setURLRequest("https://www.googleapis.com/drive/v2/files?maxResults=1000&orderBy=folder");
			JSONObject files = new JSONObject(googleClientWithCode.getProtectedResource());
			JSONObject res = new JSONObject();
			res.put("items", files.get("items"));
			return Response.status(200).header("Access-Control-Allow-Origin", "*").entity(res).build();
		} catch (IOException e) {
			JSONObject error = new JSONObject();
			error.put("error", "internal error");
			e.printStackTrace();
			return Response.status(500).header("Access-Control-Allow-Origin", "*").entity(error).build();
		}
	}
	
	//TODO : 
	@GET
	@Path("/file/createFile")
	@Produces(MediaType.APPLICATION_JSON)
	public Response createFile( @QueryParam("code") String code, 
								@QueryParam("id")   String id, 
								@QueryParam("name") String name,
								@QueryParam("type") String type ) {
									
		
		return null;
		
	}
	
		
}
