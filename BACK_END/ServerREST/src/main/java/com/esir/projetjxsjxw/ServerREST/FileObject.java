package com.esir.projetjxsjxw.ServerREST;

public class FileObject {
	
	private String name;
	private Integer size;
	private String author;
	private Drive drive;
	
	public Drive getDrive() {
		return drive;
	}
	public void setDrive(Drive drive) {
		this.drive = drive;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getSize() {
		return size;
	}
	public void setSize(Integer size) {
		this.size = size;
	}
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	
	@Override
	public String toString() {
		return "File from " + drive.toString() + " name : " + name + ", author : " + author + ", size" + size + ".";
	}

}
