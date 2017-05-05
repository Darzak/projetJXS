package com.esir.projetjxsjxw.ServerREST;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
"id"
})

public class ParentWithId {
	
	@JsonProperty("id")
	private String id;
	
	@JsonProperty("isRoot")
	private boolean isRoot;
	
	@JsonProperty("id")
	public String getId() {
	return id;
	}

	@JsonProperty("id")
	public void setId(String id) {
	this.id = id;
	}
	
	@JsonProperty("isRoot")
	public boolean getIsRoot() {
	return this.isRoot;
	}

	@JsonProperty("isRoot")
	public void setIsRoot(boolean id) {
	this.isRoot = isRoot;
	}

}
