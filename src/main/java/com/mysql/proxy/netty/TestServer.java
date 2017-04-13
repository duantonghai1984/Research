package com.mysql.proxy.netty;

import com.alibaba.fastjson.JSON;
import com.netty.NettyConstant;
import com.seaboat.mysql.protocol.HandshakePacket;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.DelimiterBasedFrameDecoder;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.util.ReferenceCountUtil;

public class TestServer {

    private int port;

    public TestServer(int port) {
        this.port = port;
    }

    public void run() throws Exception {
        EventLoopGroup bossGroup = new NioEventLoopGroup(); // (1)
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            ServerBootstrap b = new ServerBootstrap(); // (2)
            b.group(bossGroup, workerGroup).channel(NioServerSocketChannel.class) // (3)
                    .childHandler(new ChannelInitializer<SocketChannel>() { // (4)
                        @Override
                        public void initChannel(SocketChannel ch) throws Exception {
                            /*
                             * ByteBuf delimiter =
                             * Unpooled.copiedBuffer(NettyConstant.seq.getBytes(
                             * )); ch.pipeline().addLast(new
                             * DelimiterBasedFrameDecoder(1024, delimiter));
                             */
                            // ch.pipeline().addLast(new FixedLengthFrameDecoder(200));
                            // ch.pipeline().addLast(new StringDecoder());
                            ch.pipeline().addLast(new Hanlder());
                        }
                    }).option(ChannelOption.SO_BACKLOG, 128) // (5)
                    .childOption(ChannelOption.SO_KEEPALIVE, true); // (6)

            // Bind and start to accept incoming connections.
            ChannelFuture f = b.bind(port).sync(); // (7)
            f.channel().closeFuture().sync();
        } finally {
            workerGroup.shutdownGracefully();
            bossGroup.shutdownGracefully();
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
           // ctx.writeAndFlush(msg);
            ReferenceCountUtil.release(msg);
            System.out.println("server recMsg:"+rsMsg); 
        }

        @Override
        public void channelActive(ChannelHandlerContext ctx) throws Exception {
            // ctx.writeAndFlush("server msg\n");
        }

        @Override
        public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) { // (4)
            cause.printStackTrace();
            ctx.close();
        }
    }

    public static void main(String[] args) throws Exception {
        new TestServer(NettyConstant.port).run();
    }

}
