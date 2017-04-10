package com.hp.hpl.hessian.server;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.caucho.hessian.server.HessianServlet;

public class HessianImpl implements IHessian {

	public String say(String msg) {
		return "Hello " + msg;
	}

	public Map getMap() {
		Map map = new HashMap();
		map.put("work", "����");
		return map;
	}

	public User getUser() {
		User user = new User();
		user.setAdd("�Ϻ�");
		user.setName("���»�");
		return user;
	}

	public List getList() {
		List list = new ArrayList();
		list.add("a");
		list.add(getUser());
		list.add(getMap());
		return list;
	}

}
