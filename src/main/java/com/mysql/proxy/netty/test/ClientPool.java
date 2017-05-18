package com.mysql.proxy.netty.test;

import java.net.InetSocketAddress;

import com.netty.NettyConstant;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.pool.AbstractChannelPoolHandler;
import io.netty.channel.pool.FixedChannelPool;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.util.ReferenceCountUtil;
import io.netty.util.concurrent.Future;
import io.netty.util.concurrent.FutureListener;

public class ClientPool {
    FixedChannelPool channelPool = null;

    public void init() {
        Bootstrap bootstrap = new Bootstrap().channel(NioSocketChannel.class).group(new NioEventLoopGroup());

        bootstrap.option(ChannelOption.SO_KEEPALIVE, true);
        bootstrap.handler(new ChannelInitializer<SocketChannel>() {
            @Override
            protected void initChannel(SocketChannel socketChannel) throws Exception {
                socketChannel.pipeline().addLast(new SimHandler());
            }
        });
    
        bootstrap.remoteAddress(InetSocketAddress.createUnresolved("127.0.0.1", 8900));
       //bootstrap.connect("127.0.0.1", 8900).syncUninterruptibly();
        //创建一个FixedChannelPool
        channelPool = new FixedChannelPool(bootstrap, new ChannelPoolHandler(), 3);
    }

    public static class SimHandler extends SimpleChannelInboundHandler {

        @Override
        protected void channelRead0(ChannelHandlerContext ctx, Object msg) throws Exception {
                ByteBuf buf = (ByteBuf) msg; // (1)
                System.out.println("channelRead:"+buf.readableBytes());
                if(buf.readableBytes()>0){
                byte[] req=new byte[buf.readableBytes()];
                buf.readBytes(req);
                System.out.println("msg:"+new String(req));
                }
            
        }

        @Override
        public void channelActive(ChannelHandlerContext ctx) throws Exception {
            System.out.println("channelActive");
            ctx.write("channelActive msg");
            ctx.flush();
        }
    }

    public static class ChannelPoolHandler extends AbstractChannelPoolHandler {

        @Override
        public void channelCreated(Channel ch) throws Exception {
            System.out.println("channelCreated");

        }

        @Override
        public void channelAcquired(Channel ch) throws Exception {
            System.out.println("channelAcquired");
        }

        @Override
        public void channelReleased(Channel ch) throws Exception {
            System.out.println("channelReleased");

        }
    }

    public static void main(String[] args) throws Exception {
        ClientPool pool = new ClientPool();
        pool.init();
        FixedChannelPool channelPool = pool.channelPool;
        for (int i = 0; i < 10; i++) {
            Future<Channel> f = channelPool.acquire();
            if (f == null) {
                System.out.println("f is null");
            }
            f.addListener(new FutureListener<Channel>() {
                @Override
                public void operationComplete(Future<Channel> f) {
                    if (f.isSuccess()) {
                        Channel ch = f.getNow();
                        ch.writeAndFlush("pool test"+NettyConstant.seq);
                       // channelPool.release(ch);
                        System.out.println("send data");
                    } else {
                        System.out.println("fdfd");
                    }
                }
            });

        }
    }
}
