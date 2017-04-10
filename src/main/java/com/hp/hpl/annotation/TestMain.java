package com.hp.hpl.annotation;

import java.lang.reflect.Method;

public class TestMain {

	@TestCaseAn(id = 1, description = "hello method_1")
	public void method_1() {
		System.out.println("method1");
	}

	@TestCaseAn(id = 2)
	public void method_2() {
	}

	@TestCaseAn(id = 3, description = "last method")
	public void method_3() {
	}

	public static void main(String[] args) throws Exception {
		Method[] methods = TestMain.class.getDeclaredMethods();
		Object obj=TestMain.class.newInstance();
		for (Method method : methods) {
			boolean is = method.isAnnotationPresent(TestCaseAn.class);
			if (is) {
				TestCaseAn annotation = method.getAnnotation(TestCaseAn.class);
				method.invoke(obj, new Object[]{});
				System.out.println("Test( method = " + method.getName()
						+ " , id = " + annotation.id() + " , description = "
						+ annotation.description() + " )");
			}
		}
	}

}
