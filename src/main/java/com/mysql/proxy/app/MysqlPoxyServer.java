package com.mysql.proxy.app;

import java.io.UnsupportedEncodingException;
import java.nio.ByteBuffer;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;
import com.mysql.proxy.codes.MySqlPackDeCoder;
import com.mysql.proxy.codes.MySqlPackEnCoder;
import com.mysql.proxy.util.NettyUtil;
import com.seaboat.mysql.protocol.AuthPacket;
import com.seaboat.mysql.protocol.HandshakePacket;
import com.seaboat.mysql.protocol.MysqlMessage;
import com.seaboat.mysql.protocol.Versions;
import com.seaboat.mysql.protocol.util.RandomUtil;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;

public class MysqlPoxyServer {

    private static final Logger log  = Logger.getLogger(MysqlPoxyServer.class);

    public int                  port = 3306;
    public ServerBootstrap      bootstrap;

    public MysqlPoxyServer() {

    }

    public MysqlPoxyServer(int port) {
        this.port = port;
    }

    public void connect() throws Exception {
        EventLoopGroup bossGroup = new NioEventLoopGroup(); // (1)
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        bootstrap = new ServerBootstrap(); //1
        try {
            bootstrap.group(bossGroup, workerGroup) //2
                    .channel(NioServerSocketChannel.class) //3
                    .childHandler(new MySqlHandlerInitializer());

            bootstrap.option(ChannelOption.SO_BACKLOG, 128) // (5)
                    .childOption(ChannelOption.SO_KEEPALIVE, true); // (6)

            ChannelFuture future = bootstrap.bind(this.port).sync(); //5

            future.addListener(new ChannelFutureListener() {
                @Override
                public void operationComplete(ChannelFuture channelFuture) throws Exception {
                    if (channelFuture.isSuccess()) {
                        log.debug("Server bound");
                    } else {
                        log.error("Bound attempt failed");
                        log.error(channelFuture.cause().getMessage(), channelFuture.cause());
                    }

                }
            });
            
            
            future.channel().closeFuture().sync();

        } finally {
            workerGroup.shutdownGracefully();
            bossGroup.shutdownGracefully();
        }

    }

    public class MySqlHandlerInitializer extends ChannelInitializer<Channel> {
        @Override
        protected void initChannel(Channel ch) throws Exception {
            ch.pipeline().addLast(new MySqlPackDeCoder());
            ch.pipeline().addLast(new MySqlPackEnCoder());
            ch.pipeline().addLast(new MysqlPackageHanlder());
            //ch.pipeline().addLast(new HeartbeatHandler());
        }
    }
    
    
    public class MysqlPackageHanlder extends SimpleChannelInboundHandler{
        @Override
        public void channelActive(ChannelHandlerContext ctx) throws Exception {
            log.warn("发送握手");
            //首次发送握手包
            HandshakePacket hs = buildHandShake((byte)0);
            
            ByteBuffer buffer = ByteBuffer.allocate(256);
            hs.write(buffer);
            buffer.flip();
       
           ctx.writeAndFlush(NettyUtil.toByteBuf(buffer));
        }
        
        HandshakePacket buildHandShake(byte pakId){
            byte[] rand1 = RandomUtil.randomBytes(8);
            byte[] rand2 = RandomUtil.randomBytes(12);
            byte[] seed = new byte[rand1.length + rand2.length];
            System.arraycopy(rand1, 0, seed, 0, rand1.length);
            System.arraycopy(rand2, 0, seed, rand1.length, rand2.length);
            
            HandshakePacket hs = new HandshakePacket();
         
            hs.packetId = pakId;
            
            hs.protocolVersion = Versions.PROTOCOL_VERSION;
            hs.serverVersion = Versions.SERVER_VERSION;
            hs.threadId = 1000;
            hs.seed = rand1;
            hs.serverCapabilities = 63487;
            hs.serverCharsetIndex = 33;
            hs.serverStatus = 2;
            hs.restOfScrambleBuff = rand2;
            return hs;
        }

        @Override
        protected void channelRead0(ChannelHandlerContext ctx, Object msg) throws Exception {
            if(msg instanceof MysqlMessage){
                log.debug("接受到命令报文");
                MysqlMessage mm = (MysqlMessage)msg;
                mm.position(5);
                String sql = null;
                try {
                    sql = mm.readString("utf-8");
                    log.debug(sql);
                } catch (UnsupportedEncodingException e) {
                  
                }
            }else if(msg instanceof HandshakePacket){
                    log.debug("客户端发的握手包");
                    
                    HandshakePacket hs = buildHandShake((byte)1);
                   /* ByteBuffer buffer = ByteBuffer.allocate(256);
                    hs.write(buffer);
                    buffer.flip();
                    ctx.writeAndFlush(NettyUtil.toByteBuf(buffer));*/
                    ctx.writeAndFlush(hs);
                
            }else if(msg instanceof AuthPacket){
                log.debug("认证报文");
                log.debug(JSON.toJSONString((AuthPacket)msg));
                ctx.writeAndFlush(NettyUtil.toByteBuf(NettyUtil.AUTH_OK));
            }else if(msg instanceof byte[]){
                log.debug("字节报文");
                byte[] data=(byte[])msg;
                log.debug("报文:"+new String(data));
            }else if(msg instanceof ByteBuf){
                log.debug("ByteBuf报文");
                ByteBuf buf = (ByteBuf) msg; // (1)
                System.out.println(buf.readableBytes());
                if (buf.readableBytes() > 0) {
                    byte[] req = new byte[buf.readableBytes()];
                    buf.readBytes(req);
                    log.debug(new String(req));
                }
            }else{
                log.debug("不认识的报文"+msg.getClass().getName());
               
            }
            
        }
        
    }

    public static void main(String[] args) throws Exception {
        MysqlPoxyServer poxy=new MysqlPoxyServer();
        poxy.connect();
        
    }

}
