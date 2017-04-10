package com.hp.hpl.JMock.service;

public class Service1Impl implements Service1 {
	
	private Service1Dao dao;

	public int doSomeThing() {
		
		return 0;
	}
	

	public Service1Dao getDao() {
		return dao;
	}

	public void setDao(Service1Dao dao) {
		this.dao = dao;
	}
	
	
	
	

}
