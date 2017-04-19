package com.esir.projetjxsjxw.ServerREST;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/files")
public class Files {

	@Path("/getFile")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public FileObject getFile() {
		FileObject file = new FileObject();
		
		file.setAuthor("JD");
		file.setDrive(Drive.GOOGLE);
		file.setName("Fichier de GL");
		file.setSize(86);
		
		return file;
	}
	
	@Path("/postFile")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postFile(FileObject file) {
		String result = file.toString();
		System.out.println(result);
		return Response.status(201).entity("Track saved : " + result).build();
	}
	
}
