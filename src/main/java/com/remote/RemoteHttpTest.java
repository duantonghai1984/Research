package com.remote;


import org.springframework.remoting.httpinvoker.HttpInvokerProxyFactoryBean;

public class RemoteHttpTest {
	
	
	private RemoteHello remoteHello;

	public static void main(String[] args) {
		
		HttpInvokerProxyFactoryBean bean=new HttpInvokerProxyFactoryBean();
		bean.setServiceUrl("http://128.0.0.1/test/wan");
		bean.setServiceInterface(RemoteHello.class);
	}

}
