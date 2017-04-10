package com.netty;

import java.nio.charset.Charset;
import java.util.concurrent.TimeUnit;

import com.netty.base.NettyClientBase;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.DelimiterBasedFrameDecoder;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.codec.string.StringEncoder;

public class HeartClient extends NettyClientBase{

	public HeartClient(String host, int port) {
		super(host, port);
	}

	@Override
	public ChannelHandler getChannelHandler() {
		return new ChannelInitializer<SocketChannel>() {
            @Override
            protected void initChannel(SocketChannel ch) throws Exception {
                // 创建分隔符缓冲对象
            	ByteBuf delimiter = Unpooled.copiedBuffer("#".getBytes());
                // 当达到最大长度仍没找到分隔符 就抛出异常
                ch.pipeline().addLast(
                        new DelimiterBasedFrameDecoder(10000, true, false, delimiter));
                // 将消息转化成字符串对象 下面的到的消息就不用转化了
                //解码
                ch.pipeline().addLast(new StringEncoder(Charset.forName("UTF-8")));
                ch.pipeline().addLast(new StringDecoder(Charset.forName("GBK")));
                ch.pipeline().addLast(new HeartClientHanlder());
            }
        };
	}
	
	
	ChannelFutureListener channelFutureListener = new ChannelFutureListener() {
         public void operationComplete(ChannelFuture f) throws Exception {
             if (f.isSuccess()) {
                System.out.println("重新连接服务器成功");

             } else {
            	 System.out.println("重新连接服务器失败");
                 //  3秒后重新连接
                 f.channel().eventLoop().schedule(new Runnable() {
                     @Override
                     public void run() {
                    	 doConnect(channelFutureListener);
                     }
                 }, 3, TimeUnit.SECONDS);
             }
         }
     };
	
     
     
     public class HeartClientHanlder extends ChannelInboundHandlerAdapter {
    		
    		
    	 @Override
    	    public void channelRead(ChannelHandlerContext ctx, Object msg) { // (2)
    	         ByteBuf buf=(ByteBuf)msg;
    	         byte[] req=new byte[buf.readableBytes()];
    	         buf.readBytes(req);
    	         
    	         System.out.println(new String(req));
    	       
    	    }

    }
	
	public static void main(String[] args) {
		HeartClient client = new HeartClient("127.0.0.1", 8080);
		client.run();
	}
}
