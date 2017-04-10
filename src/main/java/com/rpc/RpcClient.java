package com.rpc;

public class RpcClient {
	public static void main(String[] args) {
		String ip = "localhost";
		int port = 9001;
		IHello hello = ProxyFactory.create(IHello.class, ip, port);
		System.out.println(hello.sayHello("wzj"));
	}
}
