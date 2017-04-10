package com.rpc;

public class HelloImpl implements IHello {
	@Override
	public String sayHello(String name) {
		return "hello:" + name;
	}
}
