package com.hp.hpl.freeMarker;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import freemarker.template.Configuration;
import freemarker.template.Template;

public class HelloFreeMarker extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		 
		  Map root=new HashMap();
		  root.put("message", "hello world");
		  root.put("name","duant");
		  //root.put("personList", list);
		  
		  Template t=cfg.getTemplate("test.ftl");
		  
		  resp.setContentType("text/html;charset="+t.getEncoding());
		  Writer out=resp.getWriter();
		  
		  try{
			  t.process(root, out);
		  }catch(Exception e){
			  e.printStackTrace();
		  }
	}

	 private Configuration cfg = null;
	 
	@Override
	public void init() throws ServletException {
		super.init();
		cfg=new Configuration();
		cfg.setServletContextForTemplateLoading(this.getServletContext(), "/WEB-INF/templates");
	}

	public static void main(String[] arg) throws Exception{
		Configuration cfg=new Configuration();
		//cfg.setServletContextForTemplateLoading(this.getServletContext(), "/WEB-INF/templates");
		cfg.setDirectoryForTemplateLoading(new File("c:\\TEMP"));
		Map root=new HashMap();
		root.put("message", "hello world");
		root.put("name","duant");
		Writer out=new PrintWriter(System.out);
		Template t=cfg.getTemplate("test.ftl");
		t.process(root, out); 
		  
	}
	
}
