package com.hd.zk;

public class Main {

	public static void main(String[] args) {

		try {
			MonitorListener listener = new MonitorListener(null,
					"E:\\tmp\\zk.txt");
			Executor exceutor = new Executor("127.0.0.1:2181", "/testRootPath");
			exceutor.setListener(listener);

			exceutor.run();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
