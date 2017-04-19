package com.esir.projetjxsjxw.ServerREST;

import java.util.Properties;

public class MainClass {
	
	public static void main(String[] args) {
		Properties properties = OAuthUtils.getClientConfigProps(OAuthConstants.CONFIG_FILE_PATH);
		//Properties dropBoxPorperties = OAuthUtils.getClientConfigProps("src\\main\\java\\com\\esir\\projetjxsjxw\\ServerREST\\Oauth2ClientDropBox.config");
		
		GoogleClient googleClient = new GoogleClient(properties);
		//DropBoxClient dropBoxClient = new DropBoxClient(dropBoxPorperties);
		//System.out.println(dropBoxClient.getAuthorizationCodeURL());
		System.out.println(googleClient.getAuthorizationCodeURL());
	}

}
