package com.netty;


import com.netty.base.NettyServerBase;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.LineBasedFrameDecoder;
import io.netty.handler.codec.serialization.ClassResolvers;
import io.netty.handler.codec.serialization.ObjectDecoder;
import io.netty.handler.codec.serialization.ObjectEncoder;
import io.netty.handler.codec.string.StringDecoder;

/**
 * Discards any incoming data.
 */
public class DiscardServer extends NettyServerBase {

  
    public DiscardServer(int port) {
		super(port);
	}

    public class DiscardServerHandler extends ChannelInboundHandlerAdapter { // (1)

    	private int counter;
    	
        @Override
        public void channelRead(ChannelHandlerContext ctx, Object msg) { // (2)
           
             ByteBuf buf=(ByteBuf)msg;
             byte[] req=new byte[buf.readableBytes()];
             buf.readBytes(req);
             String body="fdsfdfd";
             System.out.println("counter:"+(this.counter++));
             System.out.println(new String(req));
             ByteBuf resp=Unpooled.copiedBuffer(body.getBytes());
             ctx.writeAndFlush(resp);
        }
        
        
        
        /*@Override
        public void channelActive(final ChannelHandlerContext ctx) { // (1)
            final ByteBuf time = ctx.alloc().buffer(4); // (2)
            time.writeInt((int) (System.currentTimeMillis() / 1000L + 2208988800L));

            final ChannelFuture f = ctx.writeAndFlush(time); // (3)
            f.addListener(new ChannelFutureListener() {
                @Override
                public void operationComplete(ChannelFuture future) {
                    assert f == future;
                   // ctx.close();
                }
            }); // (4)
        }*/

        @Override
        public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) { // (4)
            cause.printStackTrace();
            ctx.close();
        }
    }

    public static void main(String[] args) throws Exception {
        new DiscardServer(8080).run();
    }

	@Override
	public ChannelHandler getChannelHandler() {
		return new ChannelInitializer<SocketChannel>() { // (4)
            @Override
            public void initChannel(SocketChannel ch) throws Exception {
           	/* ch.pipeline().addLast(new LineBasedFrameDecoder(1024));
           	 ch.pipeline().addLast(new StringDecoder());*/
           	 //ch.pipeline().addLast(new ObjectDecoder(1024*1024,ClassResolvers.weakCachingConcurrentResolver(this.getClass().getClassLoader())));
           	// ch.pipeline().addLast(new ObjectEncoder());
                ch.pipeline().addLast(new DiscardServerHandler());
            }
        };
	}
}