package com.esir.projetjxsjxw.ServerREST;

import java.util.Map;
import java.util.Properties;


/**
 * 
 * @author typhu
 * TODO : tout
 */
public class DropBoxClient {
	
	private OAuth2Details oAuth2Details;
	private String accessCode = null;
	private String authorizationCode = null;
	
	public DropBoxClient(Properties properties) {
		oAuth2Details = OAuthUtils.createOAuthDetails(properties);

		authorizationCode = OAuthUtils.getAuthorizationCode(oAuth2Details);
	}
	
	public String getAuthorizationCodeURL() {
		return authorizationCode;
	}
	
	public void setAccessCode(String accessCode) {
		this.accessCode = accessCode; 
	}
	
	public Map<String, String> getAccessToken() {
		return OAuthUtils.getAccessToken(oAuth2Details, accessCode);
	}
	
	public Map<String, String> getProtectedResource() {
		return OAuthUtils.getProtectedResource(oAuth2Details);
	}
	
	public Map<String, String> getRefreshToken() {
		return OAuthUtils.refreshAccessToken(oAuth2Details);
	}
	
	public OAuth2Details getOAuth2Details() {
		return oAuth2Details;
	}
	
	public void setURLRequest(String url) {
		oAuth2Details.setResourceServerUrl(url);
	}
	
	public String toString() {
		return accessCode + " : " + authorizationCode;
	}

}
