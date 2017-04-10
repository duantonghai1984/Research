package com.netty;

import java.util.concurrent.TimeUnit;

import com.netty.base.NettyServerBase;

import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.timeout.IdleStateHandler;

public class HeartCheckServer  extends NettyServerBase{

	public HeartCheckServer(int port) {
		super(port);
	}

	@Override
	public ChannelHandler getChannelHandler() {
		return new ChannelInitializer<SocketChannel>() { // (4)
            @Override
            public void initChannel(SocketChannel ch) throws Exception {
           	 ch.pipeline().addLast("ping", new IdleStateHandler(2, 2, 2,TimeUnit.SECONDS));
            }
        };
	}
	
	
	
	 public static void main(String[] args) throws Exception {
	        new HeartCheckServer(8080).run();
	    }

}
