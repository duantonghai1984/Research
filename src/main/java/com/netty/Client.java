package com.netty;

import com.netty.base.NettyClientBase;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.SocketChannel;


public class Client extends NettyClientBase{

	public Client(String host, int port) {
		super(host, port);
	}
	
	@Override
	public ChannelHandler getChannelHandler() {
		return new ChannelInitializer<SocketChannel>() {
            @Override
            public void initChannel(SocketChannel ch) throws Exception {
                ch.pipeline().addLast(new TimeClientHandler());
            }
        };
	}


	public static class TimeClientHandler  extends ChannelInboundHandlerAdapter {
		int counter=0;
        byte[] req="Query time order\n".getBytes();
		
		@Override
		public void channelActive(ChannelHandlerContext ctx) throws Exception {
			ByteBuf message=null;
			for(int i=0;i<100;i++){
				message=Unpooled.buffer(req.length);
				message.writeBytes(req);
				ctx.writeAndFlush(message);
			}
		}

		@Override
	    public void channelRead(ChannelHandlerContext ctx, Object msg) {
	       /* ByteBuf m = (ByteBuf) msg; // (1)
	        try {
	            long currentTimeMillis = (m.readUnsignedInt() - 2208988800L) * 1000L;
	            System.out.println(new Date(currentTimeMillis));
	           // ctx.close();	            
	            ctx.write("test1");
	        } finally {
	            m.release();
	        }*/
	    }

	    @Override
	    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
	        cause.printStackTrace();
	        ctx.close();
	    }
	}
	
	

	public static void main(String[] args) {
	        Client client=new Client("127.0.0.1",8080);
	        client.run();
	}

}
