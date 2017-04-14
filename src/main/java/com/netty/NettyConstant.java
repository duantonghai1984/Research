package com.netty;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;

public class NettyConstant {
    
    
    public static final String seq="$_";
    
    public static final int fixLenth=10;
    
    
    public static final int port=3306;
    public static final String host="127.0.0.1";
    
    
    public void read(Object msg){
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
        
        
        
       /* ByteBuf message=Unpooled.buffer(buffer.remaining());
        message.writeBytes(buffer);
        ctx.writeAndFlush(message);*/
    }

}
