package com.sea.zk;

/**
 * A simple example program to use DataMonitor to start and
 * stop executables based on a znode. The program watches the
 * specified znode and saves the data that corresponds to the
 * znode in the filesystem. It also starts the specified program
 * with the specified arguments when the znode exists and kills
 * the program if the znode goes away.
 */
import java.io.IOException;

import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooKeeper;

public class Executor implements Watcher, Runnable {

    String znode;
    DataMonitor dm;
    ZooKeeper zk;

    public Executor (String hostPort, String znode) throws KeeperException, IOException {
        zk = new ZooKeeper (hostPort, 3000, this);
        dm = new DataMonitor (zk, znode, null, null);

    }

    /***************************************************************************
     * We do process any events ourselves, we just need to forward them on.
     * 
     * @see org.apache.zookeeper.Watcher#process(org.apache.zookeeper.proto.WatcherEvent)
     */
    public void process (WatchedEvent event) {
        dm.process (event);
    }

    public void run () {
        try {
            synchronized (this) {
                while (!dm.dead) {
                    wait ();
                    System.out.println ("wait");
                }
            }
        }
        catch (InterruptedException e) {
        }
    }

    public void setListener (MonitorListener listener) {
        this.dm.listener = listener;
    }

    /**
     * @param args
     */
    public static void main (String[] args) {

        try {
            MonitorListener listener = new MonitorListener (null, "E:\\tmp\\zk.txt");
            Executor exceutor = new Executor ("127.0.0.1:2181", "/testRootPath");
            exceutor.setListener (listener);

            exceutor.run ();
        }
        catch (Exception e) {
            e.printStackTrace ();
        }
    }
}