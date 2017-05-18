package com.jvm;

import java.util.HashMap;

/**
 * 测试虚拟机卡顿现象
 * @author tonyduan
 *
 */
public class StopTheWorld {
	
	
	public static class MyThread extends Thread{
	  HashMap map=new HashMap();
	  
	  public void run(){
		  try{
			  while(true){
				  if(map.size()*512/1024/1024/1024>=900){
					  map.clear();
					  System.out.println("clean up");
				  }
				  byte[] bl;
				  for(int i=0;i<100;i++){
					  bl=new byte[512];
					  map.put(System.nanoTime(), bl);
				  }
				  Thread.sleep(1l);
			  }
		  }catch(Exception e){
			  e.printStackTrace();
		  }
	  }
	}
	
	
	
	public static class PrintThread extends Thread{
		public static final long startTime=System.currentTimeMillis();
		
		public void run(){
			try{
				while(true){
					long t=System.currentTimeMillis()-startTime;
					System.out.println(t/1000+"."+t%1000);
					Thread.sleep(100);
				}
			}catch(Exception e){
				e.printStackTrace();
			}
		}
	}
	

	public static void main(String[] args) {
		// -Xmx1g -Xms1g -Xmn512k -XX:+UseSerialGC -Xloggc:gc.log -XX:+PrintGCDetails
		new MyThread().start();
		new PrintThread().start();

	}

}
