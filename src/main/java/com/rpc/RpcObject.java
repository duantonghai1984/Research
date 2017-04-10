package com.rpc;

import java.io.Serializable;

public class RpcObject implements Serializable{
	private static final long serialVersionUID = 1L;
	
	 private String     requestId;
	private Class c;
	private String methodName;
	private Object[] args;
	
	public RpcObject() {
	}
	
	public RpcObject(Class c, String methodName, Object[] args) {
		this.c = c;
		this.methodName = methodName;
		this.args = args;
	}
	public Class getC() {
		return c;
	}
	public void setC(Class c) {
		this.c = c;
	}
	public String getMethodName() {
		return methodName;
	}
	public void setMethodName(String methodName) {
		this.methodName = methodName;
	}
	public Object[] getArgs() {
		return args;
	}
	public void setArgs(Object[] args) {
		this.args = args;
	}

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }
	
	
}
