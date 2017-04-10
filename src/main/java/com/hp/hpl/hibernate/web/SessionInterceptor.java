package com.hp.hpl.hibernate.web;

import java.io.IOException;
import java.util.logging.Logger;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.hibernate.Session;
import org.hibernate.context.internal.ManagedSessionContext;

import com.hp.hpl.hibernate.util.HibernateUtil;

/**
 * Illustrates a servlet filter used to apply a Hibernate session
 * to the "context" of the web request.
 *
 * @author Steve Ebersole
 */
public class SessionInterceptor implements Filter {

	private static final Logger log = Logger.getLogger(SessionInterceptor.class.getName() );
	

	public void doFilter(
			ServletRequest request,
			ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		log.info( "===> opening session for request [" + request.hashCode() + "]" );
		// Start the session to be used for this request
		Session session = HibernateUtil.getSessionFactory().openSession();
		try {
			// make the session available to the session factory's "current context"
			ManagedSessionContext.bind( session );

			// pass control along to the rest of the processing chain
			chain.doFilter( request, response );
		}
		finally {
			log.info( "===> cleaning-up session for request [" + request.hashCode() + "]" );
			// remove session from "current context"
			ManagedSessionContext.unbind( HibernateUtil.getSessionFactory() );

			try {
				session.close();
			}
			catch( Throwable t ) {
				log.warning( "was unable to properly close session for request [" + request.hashCode() + "]" );
			}
		}
	}

	public void init(FilterConfig filterConfig) throws ServletException {
	}

	public void destroy() {
	}
}
