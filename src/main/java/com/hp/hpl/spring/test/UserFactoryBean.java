package com.hp.hpl.spring.test;

import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.InitializingBean;

import com.hp.hpl.spring.beans.User;

public class UserFactoryBean implements FactoryBean, InitializingBean{

	@Override
	public Object getObject() throws Exception {
		return new User();
	}

	@Override
	public Class getObjectType() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean isSingleton() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		
		System.out.println("afterPropertiesSet");
	}

}
