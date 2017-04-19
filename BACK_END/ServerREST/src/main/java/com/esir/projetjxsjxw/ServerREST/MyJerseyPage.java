package com.esir.projetjxsjxw.ServerREST;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/hello")
public class MyJerseyPage {
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String sayHtmlHello() {
		return "Hello from Jersey";
	}
}