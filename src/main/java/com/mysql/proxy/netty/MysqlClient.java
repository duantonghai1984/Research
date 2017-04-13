package com.mysql.proxy.netty;

import java.nio.ByteBuffer;
import java.security.NoSuchAlgorithmException;



import com.alibaba.fastjson.JSON;
import com.netty.Client;
import com.netty.Client.TimeClientHandler;
import com.netty.base.NettyClientBase;
import com.seaboat.mysql.protocol.AuthPacket;
import com.seaboat.mysql.protocol.Capabilities;
import com.seaboat.mysql.protocol.HandshakePacket;
import com.seaboat.mysql.protocol.util.RandomUtil;
import com.seaboat.mysql.protocol.util.SecurityUtil;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOutboundHandlerAdapter;
import io.netty.channel.ChannelPromise;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.socket.SocketChannel;
import io.netty.util.ReferenceCountUtil;

public class MysqlClient extends NettyClientBase {

    public MysqlClient(String host, int port) {
        super(host, port);
    }

    @Override
    public ChannelHandler getChannelHandler() {
        return new ChannelInitializer<SocketChannel>() {
            @Override
            public void initChannel(SocketChannel ch) throws Exception {
                ch.pipeline().addLast(new ClientHanlder());
            }
        };
    }

    
    public static  class ClientHanlder extends SimpleChannelInboundHandler{

        @Override
        protected void channelRead0(ChannelHandlerContext ctx, Object msg) throws Exception {
            ByteBuf buf = (ByteBuf) msg; // (1)
            System.out.println("channelRead:"+buf.readableBytes());
            if(buf.readableBytes()>0){
            byte[] req=new byte[buf.readableBytes()];
            buf.readBytes(req);
           /* AuthPacket auth = new AuthPacket();
            auth.read(req);*/
            HandshakePacket pac=new HandshakePacket();
            pac.read(req);
            MysqlContans.handshark=pac;
            
            System.out.println(JSON.toJSONString(pac));
            }
            
        }
        
        @Override
        public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
            cause.printStackTrace();
        }
        
    }
   
    public static  class AuthClientHandler extends ChannelInboundHandlerAdapter{
        
        @Override
        public void channelActive(ChannelHandlerContext ctx) throws Exception {
            super.channelActive(ctx);
            /*byte[] rand1 = RandomUtil.randomBytes(8);
            byte[] rand2 = RandomUtil.randomBytes(12);
            byte[] seed = new byte[rand1.length + rand2.length];
            System.arraycopy(rand1, 0, seed, 0, rand1.length);
            System.arraycopy(rand2, 0, seed, rand1.length, rand2.length);

            AuthPacket auth = new AuthPacket();
            auth.packetId = 0;
            auth.clientFlags =501381l; getClientCapabilities();
            auth.maxPacketSize = 1024 * 1024 * 16;
            auth.charsetIndex=33;
            auth.user = "root";
            try {
                auth.password = SecurityUtil
                        .scramble411("root".getBytes(), seed);
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
            }
            auth.database = "db_0";
            System.out.println(JSON.toJSONString(auth));
            ByteBuffer buffer = ByteBuffer.allocate(256);
            auth.write(buffer);
            buffer.flip();
            ctx.writeAndFlush(buffer);*/
            
            /*AuthPacket auth= MysqlContans.buildAuthPack("root", "root", MysqlContans.handshark);
            ByteBuffer buffer = ByteBuffer.allocate(256);
            auth.write(buffer);
            buffer.flip();
            ctx.writeAndFlush(buffer);*/
        }

        @Override
        public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
             ByteBuf buf = (ByteBuf) msg; // (1)
             System.out.println("channelRead:"+buf.readableBytes());
             if(buf.readableBytes()>0){
             byte[] req=new byte[buf.readableBytes()];
             buf.readBytes(req);
            /* AuthPacket auth = new AuthPacket();
             auth.read(req);*/
             
             HandshakePacket pac=new HandshakePacket();
             pac.read(req);
             MysqlContans.handshark=pac;
             
             System.out.println(JSON.toJSONString(pac));
             }
             ReferenceCountUtil.release(msg);   
        }

        @Override
        public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
            cause.printStackTrace();
        }
        
   }
    
   
    
  
    
    public static void main(String[] args) throws Exception {
        MysqlClient client=new MysqlClient("127.0.0.1",3306);
        client.run();
       
        AuthPacket auth= MysqlContans.buildAuthPack("root", "root", MysqlContans.handshark);
        ByteBuffer buffer = ByteBuffer.allocate(256);
        auth.write(buffer);
        buffer.flip();
        client.socketChannel.writeAndFlush(buffer); 
        client.socketChannel.writeAndFlush("test");
        
        System.in.read();
        System.in.read();
}
    
}
