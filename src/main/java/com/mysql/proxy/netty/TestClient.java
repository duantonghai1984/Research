package com.mysql.proxy.netty;

import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;

import com.netty.NettyConstant;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoop;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.DelimiterBasedFrameDecoder;
import io.netty.handler.codec.string.StringDecoder;

public class TestClient {
    
    private static final Logger log = Logger.getLogger(TestClient.class);
    
    public String host;
    public int port;
    public String name;
    
    public Channel socketChannel;
    
    private Bootstrap b;
   
  
    
    public TestClient(String host, int port,String name) {
        this.host=host;
        this.port=port;
        this.name=name;
        try {
            connect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    
    public void connect() throws Exception{
        EventLoopGroup workerGroup = new NioEventLoopGroup();

        try {
            b = new Bootstrap(); // (1)
            b.group(workerGroup); // (2)
            b.channel(NioSocketChannel.class); // (3)
            b.option(ChannelOption.SO_KEEPALIVE, true); // (4)
            b.handler(new ChannelInitializer<SocketChannel>() {
                @Override
                public void initChannel(SocketChannel ch) throws Exception {
                    ch.pipeline().addLast(new Hanlder());
                }
            });

            // Start the client.
            ChannelFuture f = b.connect(host, port).sync(); // (5)

             if(f.isSuccess()){
                 socketChannel=f.channel();
             }
             System.out.println("connect sus");
            // Wait until the connection is closed.
            f.channel().closeFuture().sync();
            
           
            
        } finally {
            workerGroup.shutdownGracefully();
        }
  }
    
    
    
    
    public void sent(final Object msg) {
        if(this.socketChannel.isActive()){
        this.socketChannel.pipeline().writeAndFlush(msg);
        this.socketChannel.flush();
        System.out.println("channel is not active");
        }else{
            System.out.println("channel is not active");
        }
    }
    
    public static class Hanlder extends ChannelInboundHandlerAdapter { // (1)

        @Override
        public void channelRead(ChannelHandlerContext ctx, Object msg) { // (2)
            System.out.println("read data");
            String rsMsg = "";
            if (msg instanceof String) {
                rsMsg = (String) msg; // (1)
            } else if (msg instanceof ByteBuf) {
                ByteBuf buf = (ByteBuf) msg; // (1)
                if (buf.readableBytes() > 0) {
                    byte[] req = new byte[buf.readableBytes()];
                    buf.readBytes(req);
                    rsMsg = new String(req);
                }
            }
            
            System.out.println("client recMsg:"+rsMsg);
        }
        
        
        @Override
        public void channelActive(ChannelHandlerContext ctx) throws Exception {
            System.out.println("channelActive");
            byte[] req="client test\n".getBytes();
            ByteBuf message=Unpooled.buffer(req.length);
            message.writeBytes(req);
            ctx.writeAndFlush(message);
        }
        
          

        @Override
        public void channelInactive(ChannelHandlerContext ctx) throws Exception {
               
            super.channelInactive(ctx);
        }


        @Override
        public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) { // (4)
            cause.printStackTrace();
            ctx.close();
        }
    }
    
    public static void main(String[] args) throws Exception{
        TestClient client=new TestClient(NettyConstant.host,NettyConstant.port,"test1");
        for(int i=0;i<10;i++){
            System.out.println("send data");
          client.sent("test"+NettyConstant.seq + "test"+NettyConstant.seq + "test");
        }
        
        System.in.read();
        System.in.read();
    }
}
