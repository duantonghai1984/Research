package com.netty.base;

import io.netty.bootstrap.Bootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;

public abstract class NettyClientBase {
	
	protected String host;
	protected int port;
	
	protected Bootstrap startp;
	
	public SocketChannel socketChannel;
	
	protected ChannelFuture future;
	
    private final Object obj = new Object();
	
	public NettyClientBase(String host,int port){
		this.host=host;
		this.port=port;
	}
	
	public void run(){
		  EventLoopGroup workerGroup = new NioEventLoopGroup();
		 try {
			 startp = new Bootstrap(); // (1)
			 startp.group(workerGroup); // (2)
			 startp.channel(NioSocketChannel.class); // (3)
			 startp.option(ChannelOption.SO_KEEPALIVE, true); // (4)
			 startp.handler(this.getChannelHandler());
			 future = startp.connect(host, port).sync(); // (5)
			// future.channel().closeFuture().sync();
		        if (future.isSuccess()) {
		            socketChannel = (SocketChannel)future.channel();
		            System.out.println("connect server  成功---------");
		        }
		        
		        future.addListener(new ChannelFutureListener(){
                    @Override
                    public void operationComplete(ChannelFuture future) throws Exception {
                        System.out.println("operationComplete");
                        synchronized (obj) {
                            obj.notifyAll(); // 收到响应，唤醒线程
                        }
                    }});
		        
		        synchronized (obj) {
	                obj.wait(); // 未收到响应，使线程等待
	            }
		        future.channel().closeFuture().sync();
	        } catch(Exception e){
	        	e.printStackTrace();
	        }finally {
	            workerGroup.shutdownGracefully();
	        }
	}
	
	
	
	protected void doConnect(ChannelFutureListener channelFutureListener) {
		ChannelFuture future = null;
		try {
			future = startp.connect(host, port);
			if (channelFutureListener != null) {
				future.addListener(channelFutureListener);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

	}
	
	public abstract ChannelHandler getChannelHandler();

}
