package com.jcob;

import java.io.File;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
/*
import com.jacob.activeX.ActiveXComponent;
import com.jacob.com.Dispatch;
import com.jacob.com.Variant;*/

public class WordToPdf {
	
	/*private static final Log    log= LogFactory.getLog(WordToPdf.class);

	private static ActiveXComponent app=null;
	
	public static void init() {
		try {
			WordToPdf.app = new ActiveXComponent("kwps.Application");
		} catch (Exception e) {
			log.error(e.getMessage(),e);
		}
	}

	public static void close() {
		try {
			if (WordToPdf.app != null) {
				WordToPdf.app.invoke("Quit", new Variant[] {});
				WordToPdf.app=null;
			}
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
	}

	public static void wordToPdf(String docfile,String toFile){
		try {
			
			if(WordToPdf.app==null){
				WordToPdf.init();
			}
			
			app.setProperty("Visible", new Variant(true));
			Dispatch docs = app.getProperty("Documents").toDispatch();
			Dispatch doc = Dispatch.invoke(docs, "Open", Dispatch.Method,
					new Object[] { docfile, new Variant(false), new Variant(true) }, new int[1]).toDispatch();
			
			//Dispatch.invoke(doc, "Save", Dispatch.Method, new Object[] { toFile, new Variant(17) }, new int[1]);
			Dispatch.invoke(doc, "SaveAs2", Dispatch.Method, new Object[] { toFile,new Variant(17)}, new int[1]);
			Variant f = new Variant(false);
			Dispatch.call(doc, "Close", f);
			log.info("process sus:"+docfile+","+toFile);
			doc=null;
			docs=null;
		} catch (Exception e) {
			log.error(e.getMessage(),e);
			WordToPdf.close();
			WordToPdf.init();
		} 
		
	}
	
	public static void main(String[] args) {
		
		String docfile = "D:\\template.docx";
		String toFile = "D:\\wps";
        long start=System.currentTimeMillis();
        //WordToPdf.init();
		for(int i=0;i<10;i++){
			WordToPdf.wordToPdf(docfile, toFile+File.separator+System.currentTimeMillis()+".pdf");
		}
		WordToPdf.close();
		System.out.println("time:"+(System.currentTimeMillis()-start));
	}*/

}
