package com.hp.hpl.json;

import java.util.List;

public class Person {
	
	private String name;
	private Integer age;
	private Long  height;
	private Float width;
	
	private List stds;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getAge() {
		return age;
	}
	public void setAge(Integer age) {
		this.age = age;
	}
	public Long getHeight() {
		return height;
	}
	public void setHeight(Long height) {
		this.height = height;
	}
	public Float getWidth() {
		return width;
	}
	public void setWidth(Float width) {
		this.width = width;
	}
	
	
	
	public List getStds() {
		return stds;
	}
	public void setStds(List stds) {
		this.stds = stds;
	}
	public String toString(){
		return this.getName()+","+this.getAge()+","+this.getHeight()+","+this.getWidth()+","+this.stds.size();
	}

}
