package com.esir.projetjxsjxw.ServerREST;

import java.io.ByteArrayInputStream;

import org.codehaus.jettison.json.JSONArray;
import org.json.simple.JSONObject;


import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/tokenHandler")
public class tokenHandler {
	
	
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
						"redirect_uri=http://localhost:8080/ServerREST/myWebService/tokenHandler/test\n"+
						"authentication_server_url=https://accounts.google.com/o/oauth2/auth\n"+
						"token_endpoint_url=https://accounts.google.com/o/oauth2/token\n"+
						"resource_server_url=https://www.googleapis.com/drive/v2/about\n"+
						"#------------------------------------------------";
	
	
	@GET
	@Path("/test")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getResponse(@QueryParam("code") String code) {
		try {
			InputStream is = new ByteArrayInputStream(googleConfigFile.getBytes("UTF-8"));
			Properties config = new Properties();
			config.load(is);
			GoogleClient googleClientWithCode = new GoogleClient(config);
			googleClientWithCode.setAccessCode(code);
			String accessToken = googleClientWithCode.getAccessToken().get("access_token");
			googleClientWithCode.getOAuth2Details().setAccessToken(accessToken);
			googleClientWithCode.setURLRequest("https://www.googleapis.com/drive/v2/files");
			JSONObject files = new JSONObject(googleClientWithCode.getProtectedResource());
			return Response.status(200).entity(files).build();
		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(400).build();
		}
		
	}
	
	@GET
	@Path("/dropbox")
	@Produces(MediaType.APPLICATION_JSON)
	public String getDropBoxResponse(@QueryParam("code") String code) {
		System.out.println(code);
		return "ok";
	}

}
