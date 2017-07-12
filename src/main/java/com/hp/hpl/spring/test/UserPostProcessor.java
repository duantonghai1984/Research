package com.hp.hpl.spring.test;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.core.Ordered;

import com.hp.hpl.spring.beans.User;

public class UserPostProcessor implements BeanPostProcessor,Ordered {  
  
    @Override  
    public Object postProcessBeforeInitialization(Object o, String s) throws BeansException {  
        if(o instanceof User){  
            User user = (User)o;  
            user.setName("新名字");  
            user.setId(100);  
            return user;  
        }  
        System.out.println("postProcessBeforeInitialization");
        return o;  
  
    }  
  
    @Override  
    public Object postProcessAfterInitialization(Object o, String s) throws BeansException {  
        return o;  
    }

	@Override
	public int getOrder() {
		return 1;
	}  
}