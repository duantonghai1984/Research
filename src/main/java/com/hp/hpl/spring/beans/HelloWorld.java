package com.hp.hpl.spring.beans;

public class HelloWorld {
	
	private String msg;  
    private User user;
    
    
	public String getMsg() {
		//ProxyFactoryBean
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
    
    
    
    

}
