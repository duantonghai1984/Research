package com.hp.hpl.JMock.test;

import junit.framework.TestCase;

import org.jmock.Expectations;
import org.jmock.Mockery;

import com.hp.hpl.JMock.service.Service1Dao;
import com.hp.hpl.JMock.service.Service1Impl;

public class TestService1  extends TestCase {
	
	private Mockery context = new Mockery();
	private Service1Impl  impl=new Service1Impl();
	private Service1Dao dao;
	
	
	
	@Override
	protected void setUp() throws Exception {
		dao=this.context.mock(Service1Dao.class);
		this.impl.setDao(dao);
	}

	@Override
	protected void tearDown() throws Exception {
		super.tearDown();
	}

	public void testDoSomething(){
		this.context.checking(new Expectations(){{
            atLeast(1).of (dao).doSomeThing();
            
            will(onConsecutiveCalls(
            	       returnValue(10),
            	       returnValue(20),
            	       returnValue(30)));
        }});
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

}
