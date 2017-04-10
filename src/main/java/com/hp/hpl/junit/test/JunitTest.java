package com.hp.hpl.junit.test;

import static java.lang.System.out;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class JunitTest {
	
	@Test
	public void test1(){
		out.println("test1");
	}

	
	@Test
	public void test2(){
		out.println("test2");
	}
	
	@BeforeClass
	public static void init(){
		out.println("init");
	}
	
	@AfterClass
	public static void destroy(){
		out.println("destroy");
	}
	
	
	@Before
	public static void initM(){
		out.println("init");
	}
	
	@After
	public static void destroyM(){
		out.println("destroy");
	}


}
