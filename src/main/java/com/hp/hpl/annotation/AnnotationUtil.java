package com.hp.hpl.annotation;

import java.lang.reflect.Field;
import java.util.Collection;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


public class AnnotationUtil {
	
	private static Log log = LogFactory.getLog(AnnotationUtil.class);
	
	private AnnotationUtil(){
		
	}
	
	
	public static boolean isEmpty(String str){
		if(str==null || str.length()==0){
			return true;
		}else{
			return false;
		}
	}
	
	public static String checkRequiredField(Object obj){
		StringBuffer buff=new StringBuffer();
	   Class cls=obj.getClass();
		for (Field f : cls.getDeclaredFields()) {
			if (f.isAnnotationPresent(Required.class)) {
				f.setAccessible(true);
				try {
					Object tem = f.get(obj);
					if (tem == null) {
						buff.append(f.getName()+" 是空值,");
						break;
					} else if (tem instanceof Collection) {
						if (((Collection) tem).isEmpty()) {
							buff.append(f.getName()+" 是空值,");
							break;
						}else{
							String checkReuslt="";
							for(Object tobj:(Collection)tem){
								checkReuslt=checkRequiredField(tobj);
								if(!isEmpty(checkReuslt)){
									buff.append(checkReuslt);
									break;
								}
							}
						}
					}else if(tem instanceof String){
							Required req=f.getAnnotation(Required.class);
							if(req.maxLength()>0 && req.minLength()>=0){
								String temStr=(String)tem;
								if(temStr.length()>req.maxLength()){
									buff.append(f.getName()+"  长度超限，"+req.maxLength());
									break;
								}
								
								if(temStr.length()<req.minLength()){
									buff.append(f.getName()+"  长度太短，"+req.minLength());
									break;
								}
							}
						}
					
				} catch (Throwable e) {
					log.error(e);
				}
			}
		}
		return buff.toString();
	}

}
