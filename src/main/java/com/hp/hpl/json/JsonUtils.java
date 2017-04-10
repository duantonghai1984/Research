package com.hp.hpl.json;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


public class JsonUtils {
	final static Log log = LogFactory.getLog(JsonUtils.class);
	
	/**
	 * 将数据集转化为json对象
		{                                                      
			"total":2,                                                      
			"rows":[                                                          
				{"code":"001","name":"Name 1","addr":"Address 11","col4":"col4 data"},         
				{"code":"010","name":"Name 10","addr":"Address 78","col4":"col4 data"}     
			]                                                          
		}
	 * @param totalCount
	 * @param obj
	 * @return
	 */
	public static JSONObject toGridJson(int totalCount,Object obj){
		//如果数据集对象为null做个特殊处理
		if(null==obj){
			JSONObject jsonResult = new JSONObject();
			jsonResult.put("total", totalCount);
			jsonResult.put("rows", new JSONArray());
			return jsonResult;
		}
		if(!Collection.class.isAssignableFrom(obj.getClass())){
			JSONObject jsonResult = new JSONObject();
			jsonResult.put("total", totalCount);
			jsonResult.put("rows", new JSONArray());
			return jsonResult;
		}
		JSONArray jsonArray = JSONArray.fromObject(obj);
		JSONObject jsonResult = new JSONObject();
		jsonResult.put("total", totalCount);
		jsonResult.put("rows", jsonArray);
		return jsonResult;
	}
	
	public static boolean isBaseType(Object obj){
		boolean result1=Number.class.isInstance(obj);
		result1=result1 ||String.class.isInstance(obj);
		result1=result1 ||Character.class.isInstance(obj);
		result1=result1 ||Byte.class.isInstance(obj);
		result1=result1 ||Boolean.class.isInstance(obj); 
		result1=result1 ||Void.class.isInstance(obj);  
		result1=result1 || obj==null; 
		result1=result1 ||Date.class.isInstance(obj);
		return result1;
	}
	
	
	public static String getJsonArrayStrFromObject(Collection obj){
		JSONArray jsonArray=new JSONArray();
		Iterator it=obj.iterator();
		while(it.hasNext()){
			Object objT=it.next();
			if(isBaseType(objT)){
				jsonArray.add(objT);
			}else{
			   jsonArray.add(getJsonFromObject(objT));
			}
		}
		return jsonArray.toString();
	}
	
	public static JSONArray getJsonArrayFromObject(Collection obj){
		JSONArray jsonArray=new JSONArray();
		Iterator it=obj.iterator();
		while(it.hasNext()){
			Object objT=it.next();
			if(isBaseType(objT)){
				jsonArray.add(objT);
			}else{
			   jsonArray.add(getJsonFromObject(objT));
			}
		}
		return jsonArray;
	}
	
	
	private static JSONObject transMapToJson(Map<Object,Object> obj) {
	
		if (Map.class.isInstance(obj)) {
			JSONObject json = new JSONObject();
			Iterator<Map.Entry<Object,Object>> it = ((Map<Object,Object>) obj).entrySet().iterator();
			Map.Entry entry = null;
			while (it.hasNext()) {
				entry = it.next();
				if (isBaseType(entry.getValue())) {
					json.put(entry.getKey(), entry.getValue());
				} else {
					json.put(entry.getKey(), getJsonFromObject(entry.getValue()));
				}
			}
			return json;
		}else{
			throw  new RuntimeException("input is not map");
		}

	}
	
	public static  JSONObject  getJsonFromObject(Object obj){
		if(Collection.class.isInstance(obj)){
			 throw new RuntimeException("arg is a collection");
		}
	
		if(Map.class.isInstance(obj)){
			return transMapToJson((Map)obj);
		}
		
		
		JSONObject json=new JSONObject();
			
		Method[] methods=obj.getClass().getMethods();
		Object temp=null;
		String tempMname="";
		String jsonKey="";
		for(Method method:methods){
			temp=null;
			tempMname=method.getName();
			if(tempMname.startsWith("get") && tempMname.indexOf("Class")==-1
			   && (method.getParameterTypes()==null ||method.getParameterTypes().length==0)){
				try {
					temp=method.invoke(obj);
					jsonKey=method.getName().substring(3);
					jsonKey=jsonKey.substring(0, 1).toLowerCase()+jsonKey.substring(1);
					if(temp!=null){
						//process map
						if(Map.class.isInstance(temp)){
							json.put(jsonKey, transMapToJson((Map)temp));
						}else if(Collection.class.isInstance(temp)){ //process collection
							String jsonArray=getJsonArrayStrFromObject((Collection)temp);
							json.put(jsonKey, new String(jsonArray.trim()));
						}else{ //other type object
						   json.put(jsonKey, temp.toString().trim());
						}
					}else{
						json.put(jsonKey, "");	
					}
				} catch (Exception e) {
					e.printStackTrace();
				} 
			}
		}
	   return json;
	}

	
	public static Object getObjectFromJson(Class cls,JSONObject json,Map<String,Class> subElementClses){
		 try {
			Object t=cls.newInstance();
			Method[] methods=cls.getDeclaredMethods();
			String methodName="";
			for(Method method:methods){
				 methodName=method.getName();
				if (methodName.startsWith("get")
						&& methodName.indexOf("Class") == -1
						&& (method.getParameterTypes() == null 
						|| method.getParameterTypes().length == 0)) {
					executeSetMethod(t,method,json,subElementClses);
				}
					
			}
			return t;
		} catch (Exception e) {
			e.printStackTrace();
		} 
		return null;
	}
	
	
	@SuppressWarnings("unchecked")
	private static void executeSetMethod(Object instance,Method method,JSONObject json,Map<String,Class> subElementClses) throws Exception{
		String methodName=method.getName();
		String jsonKey=methodName.substring(3);
		jsonKey=jsonKey.substring(0, 1).toLowerCase()+jsonKey.substring(1);
		if (!json.containsKey(jsonKey)) {
			return;
		}
		
		Class paraCls=method.getReturnType();
		Object jsValue=null;
		if(paraCls.isPrimitive()){
			if(paraCls.isAssignableFrom(int.class)){
				jsValue=json.getInt(jsonKey);
			}else if(paraCls.isAssignableFrom(double.class)){
				jsValue=json.getDouble(jsonKey);
			}else if(paraCls.isAssignableFrom(float.class)){
				jsValue=new Float(json.getString(jsonKey));
			}else if(paraCls.isAssignableFrom(boolean.class)){
				jsValue=json.getBoolean(jsonKey);
			}else if(paraCls.isAssignableFrom(short.class)){
				jsValue=new Short(json.getString(jsonKey));
			}else if(paraCls.isAssignableFrom(long.class)){
				jsValue=json.getLong(jsonKey);
			}else if(paraCls.isAssignableFrom(char.class)){
				jsValue=new Character(json.getString(jsonKey).charAt(0));
			}
		}else if(Number.class.isAssignableFrom(paraCls) || String.class.isAssignableFrom(paraCls)
			|| Boolean.class.isAssignableFrom(paraCls)){
			if(json.getString(jsonKey)!=null){
		      jsValue=paraCls.getConstructor(String.class).newInstance(json.getString(jsonKey));
			}
		}else if(Collection.class.isAssignableFrom(paraCls)) {
			if(subElementClses==null ||subElementClses.isEmpty()){
				return;
			}
	    	Collection collection=null;
	    	if(!paraCls.isInterface()){
	    		collection=(Collection) paraCls.newInstance();
	    	}else{
	    		collection=(Collection) ArrayList.class.newInstance();
	    	}
	    	Class subCls=subElementClses.get(jsonKey);
	        if(subCls!=null){
				JSONArray jsonArray = json.getJSONArray(jsonKey);
				for(int i=0;i<jsonArray.size();i++){
					JSONObject jsonObj=jsonArray.getJSONObject(i);
					collection.add(JsonUtils.getObjectFromJson(subCls,jsonObj,null));
				}
			jsValue=collection;
	        }
		}
		Method setMethod = instance.getClass().getMethod(methodName.replace("get", "set"),paraCls);
		if (setMethod != null && jsValue!=null && setMethod.getParameterTypes().length==1) {
			setMethod.invoke(instance, jsValue);
		}else{
			log.debug("not execute "+methodName.replace("get", "set")+" paraType:"+paraCls+" arg:"+jsValue);
			//System.out.println("can not find method:"+methodName.replace("get", "set"));
		}
	}
	
	 public static void main(String[] args){
		 List o=new ArrayList();
		 for(int i=0;i<10;i++){
			 o.add("duant"+i);
		 }
		// System.out.println(JsonUtils.mapToJsonArray(o));
		 
		 String method="getNameAccount";
		 String jsonKey=method.substring(3);
			jsonKey=jsonKey.substring(0, 1).toLowerCase()+jsonKey.substring(1);
			System.out.println(jsonKey);
	 }
	 
	 
}
