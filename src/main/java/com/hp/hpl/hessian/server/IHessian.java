package com.hp.hpl.hessian.server;

import java.util.List;
import java.util.Map;

public interface IHessian {

	public String say(String msg);

	public Map getMap();

	public User getUser();

	public List getList();

}
