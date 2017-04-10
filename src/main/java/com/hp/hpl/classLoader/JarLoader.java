package com.hp.hpl.classLoader;

import java.io.File;
import java.lang.reflect.Method;

import java.net.URL;
import java.net.URLClassLoader;

public class JarLoader {
	
	
	public static void loadJar(String libPath) throws Exception{
		  /*String path=Test.class.getClassLoader ().getResource ("Test.class").getPath ();
        int index=path.indexOf (".jar");
        path=path.substring (0,index);
        System.out.println (path);
        File file=new File(new URI(path)).getParentFile ();
        file=new File(file.getPath ()+File.separator+"lib");
        */
        File file=new File(libPath);
        
        File[] files=file.listFiles ();
        URL[] urlss=new URL[files.length];
        for(int i=0;i<files.length;i++){
        	if(files[i].getName().endsWith(".jar")){
            System.out.println (files[i].getPath ());
            urlss[i]=new URL("file:"+files[i].getPath ());
        	}
        }
         
        URLClassLoader ucl = new URLClassLoader(urlss,Thread.currentThread ().getContextClassLoader ());  
        Thread.currentThread ().setContextClassLoader (ucl);
       
        
        ClassLoader loder= Thread.currentThread ().getContextClassLoader ();
        System.out.println ("当前线程classLoader:"+loder);
        
        Class c = loder.loadClass("Test");
        //Object test=Class.forName("Test",true, ucl).newInstance (); 
        Object test=c.newInstance ();
          
        System.out.println ("类加载loader:"+test.getClass ().getClassLoader ());
        
        Method method=c.getMethod ("testJson", null);
        method.invoke (test, null);
        
        System.exit (1);
	}

	public static void main(String[] args) {
		

	}

}
