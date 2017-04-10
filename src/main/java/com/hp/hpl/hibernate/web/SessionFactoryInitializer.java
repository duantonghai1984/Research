package com.hp.hpl.hibernate.web;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.hp.hpl.hibernate.util.HibernateUtil;

/**
 * Demonstrates good practice of making sure the SessionFactory is initialized
 * on application startup, rather than on first request.  Here we register
 * as a listener to the servlet context lifecycle for building/closing of the
 * SessionFactory.
 *
 * @author Steve Ebersole
 */
public class SessionFactoryInitializer implements ServletContextListener {
	public void contextInitialized(ServletContextEvent event) {
		System.out.println("contextInitialized");
		HibernateUtil.getSessionFactory();
	}

	public void contextDestroyed(ServletContextEvent event) {
		HibernateUtil.getSessionFactory().close();
		System.out.println("contextDestroyed");
	}
}
