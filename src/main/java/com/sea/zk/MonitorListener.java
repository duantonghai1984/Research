package com.sea.zk;

import java.io.FileOutputStream;
import java.io.IOException;

/**
 * ---- 请加注释 ------
 * 
 * @Author duantonghai
 * @CreateTime 2015-1-5 下午2:43:52
 */
public class MonitorListener implements DataMonitorListener {

    String exec[];
    Process child;
    String filename;

    public MonitorListener (String exec[], String fileName) {
        this.exec = exec;
        this.filename = fileName;
    }

    public void exists (byte[] data) {
        if (data == null) {
            if (child != null) {
                System.out.println ("Killing process");
                child.destroy ();
                try {
                    child.waitFor ();
                }
                catch (InterruptedException e) {
                }
            }
            child = null;
        }
        else {
            if (child != null) {
                System.out.println ("Stopping child");
                child.destroy ();
                try {
                    child.waitFor ();
                }
                catch (InterruptedException e) {
                    e.printStackTrace ();
                }
            }
            try {
                FileOutputStream fos = new FileOutputStream (filename);
                fos.write (data);
                fos.close ();
            }
            catch (IOException e) {
                e.printStackTrace ();
            }
            try {
                System.out.println ("Starting child");
                child = Runtime.getRuntime ().exec (exec);
                new StreamWriter (child.getInputStream (), System.out);
                new StreamWriter (child.getErrorStream (), System.err);
            }
            catch (IOException e) {
                e.printStackTrace ();
            }
        }
    }

    public void closing (int rc) {
        synchronized (this) {
            notifyAll ();
        }
    }
}
