package com.nio;

import java.io.IOException;
import java.net.DatagramSocket;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.SocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.DatagramChannel;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.Iterator;
import java.util.Set;

import org.apache.log4j.Logger;

public class NIOConnector extends Thread {

    private static final Logger LOGGER = Logger.getLogger(NIOConnector.class);

    private final String        name;
    private final Selector      selector;

    private long                connectCount;

    public NIOConnector(String name) throws IOException {
        super.setName(name);
        this.name = name;
        this.selector = Selector.open();
    }

    @Override
    public void run() {
        final Selector tSelector = this.selector;
        for (;;) {
            ++connectCount;
            try {
                //查看有无连接就绪
                tSelector.select(1000L);
                //connect();
                Set<SelectionKey> keys = tSelector.selectedKeys();
                try {
                    for (SelectionKey key : keys) {
                        Object att = key.attachment();
                        if (att != null && key.isValid() && key.isConnectable()) {
                            finishConnect(key, att);
                        } else {
                            key.cancel();
                        }
                    }
                } finally {
                    keys.clear();
                }
            } catch (Exception e) {
                LOGGER.warn(name, e);
            }
        }
        
    }

    public void connect() throws Exception {

        SocketChannel channel = SocketChannel.open();
        channel.register(this.selector, SelectionKey.OP_ACCEPT, null);
        channel.connect(new InetSocketAddress("127.0.0.1", 600));

        /*
         * AbstractConnection c = null; while ((c = connectQueue.poll()) !=
         * null) { try { SocketChannel channel = (SocketChannel) c.getChannel();
         * //注册OP_CONNECT监听与后端连接是否真正建立 channel.register(selector,
         * SelectionKey.OP_CONNECT, c); //主动连接 channel.connect(new
         * InetSocketAddress(c.host, c.port)); } catch (Exception e) {
         * c.close(e.toString()); } }
         */
    }

    private void finishConnect(SelectionKey key, Object att) {
        /*
         * BackendAIOConnection c = (BackendAIOConnection) att; try { if
         * (finishConnect(c, (SocketChannel) c.channel)) { //做原生NIO连接是否完成的判断和操作
         * clearSelectionKey(key); c.setId(ID_GENERATOR.getId());
         * //绑定特定的NIOProcessor以作idle清理 NIOProcessor processor =
         * MycatServer.getInstance() .nextProcessor();
         * c.setProcessor(processor); //与特定NIOReactor绑定监听读写 NIOReactor reactor =
         * reactorPool.getNextReactor(); reactor.postRegister(c); } } catch
         * (Exception e) { //如有异常，将key清空 clearSelectionKey(key);
         * c.close(e.toString()); c.onConnectFailed(e); }
         */
    }

    public static void server(int port) throws Exception {
        ByteBuffer buffer = ByteBuffer.wrap("test".getBytes());
        final ServerSocketChannel ssc = ServerSocketChannel.open();
        ssc.socket().bind(new InetSocketAddress(port));
        ssc.configureBlocking(false);

        Selector selector=Selector.open();
        ssc.register(selector, SelectionKey.OP_ACCEPT);
        
        while(true){
            int n=selector.select();
            if(n==0){
                continue;
            }
            Iterator it=selector.selectedKeys().iterator();
            while(it.hasNext()){
                SelectionKey key=(SelectionKey)it.next();
                if(key.isAcceptable()){
                    ServerSocketChannel server=(ServerSocketChannel)key.channel();
                    if(server!=null){
                    server.configureBlocking(false);
                    server.register(selector, SelectionKey.OP_READ);
                    }
                }
                
                if(key.isReadable()){
                    ServerSocketChannel server=(ServerSocketChannel)key.channel();
                    if(server!=null){
                        
                        buffer.clear();
                       // while()
                        
                    }
                }
                
                it.remove();
            }
        }
       /* new Thread(new Runnable() {

            @Override
            public void run() {
                while (true) {
                    SocketChannel sc;
                    try {
                        sc = ssc.accept();
                        if (sc != null) {
                            System.out.println("connect ssc");
                            buffer.rewind();
                            sc.write(buffer);
                            sc.close();
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }

        }).start();*/

    }
    
    

    public static void client(String host, int port) throws Exception {
        System.out.println("client start");
        SocketChannel channel = SocketChannel.open();
        System.out.println(channel.connect(new InetSocketAddress(host, port)));
        System.out.println("client over");
    }
    
    public static void dataGram(int port) throws Exception{
        DatagramChannel channel=DatagramChannel.open();
        DatagramSocket socket=channel.socket();
        socket.bind(new InetSocketAddress(port));
       // channel.send(src, target)
       // channel.receive(dst)
        
      
    }

    public static void main(String[] args) throws Exception {

        NIOConnector.server(600);

        NIOConnector.client("127.0.0.1", 600);

        NIOConnector.client("127.0.0.1", 600);
        NIOConnector.client("127.0.0.1", 600);

        /*
         * NIOConnector connector=new NIOConnector("test"); connector.connect();
         * connector.start();
         */

    }

}
