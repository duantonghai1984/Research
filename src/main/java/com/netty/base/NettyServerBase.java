package com.netty.base;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;

public abstract class NettyServerBase {

	protected int port;
	
	protected ServerBootstrap starp;
	protected ChannelFuture future;

	public NettyServerBase(int port) {
		this.port = port;
	}

	public void run() throws Exception {
		EventLoopGroup bossGroup = new NioEventLoopGroup(); // (1)
		EventLoopGroup workerGroup = new NioEventLoopGroup();
		try {
			 starp = new ServerBootstrap(); // (2)
			 starp.group(bossGroup, workerGroup).channel(NioServerSocketChannel.class) // (3)
					.childHandler(this.getChannelHandler()).option(ChannelOption.SO_BACKLOG, 128) // (5)
					.childOption(ChannelOption.SO_KEEPALIVE, true); // (6)

			// Bind and start to accept incoming connections.
			 future = starp.bind(port).sync(); // (7)
			 future.channel().closeFuture().sync();
		} finally {
			workerGroup.shutdownGracefully();
			bossGroup.shutdownGracefully();
		}
	}
	
	public abstract ChannelHandler getChannelHandler();
	
}
