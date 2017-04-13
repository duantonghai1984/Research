package com.netty.http;

import com.netty.base.NettyServerBase;

import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpRequestDecoder;
import io.netty.handler.codec.Delimiters;

public class HttpFileServer extends NettyServerBase {

	public HttpFileServer(int port) {
		super(port);
	}

	@Override
	public ChannelHandler getChannelHandler() {
		return new ChannelInitializer<SocketChannel>() {
            @Override
            public void initChannel(SocketChannel ch) throws Exception {
           	 ch.pipeline().addLast("http-decoder",new HttpRequestDecoder());
           	ch.pipeline().addLast("http-aggregator",new HttpObjectAggregator(65536));
           	 
            }
        };
	}

}
