package com.hp.hpl.hibernate.test;

import java.util.Date;

import junit.framework.TestCase;

import org.hibernate.Session;

import com.hp.hpl.hibernate.hbm.Event;
import com.hp.hpl.hibernate.util.HibernateUtil;



public class HibernateTest extends TestCase{


	@Override
	protected void setUp() throws Exception {
		super.setUp();
		
	}

	@Override
	protected void tearDown() throws Exception {
		super.tearDown();
	}

	public void testAdd(){
		Session session=HibernateUtil.getSessionFactory().openSession();
		
		
		System.out.println("Test");
		Event event=new Event();
		event.setDate(new Date());
		event.setTitle("title");
		
		session.save(event);
		session.flush();
		
		Event e2=(Event)session.load(Event.class, new Long(1));
		System.out.println(e2.getTitle());
		
		session.close();
	}
}
