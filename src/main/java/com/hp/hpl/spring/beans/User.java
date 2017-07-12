package com.hp.hpl.spring.beans;

import org.springframework.beans.factory.annotation.Value;

public class User {
	
	@Value("老名字")  
    private String name;  
    @Value("50")  
    private Integer id; 
    
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	@Override  
    public String toString() {  
        return "User{" +  
                "name='" + name + '\'' +  
                ", id=" + id +  
                '}';  
    }  

}
