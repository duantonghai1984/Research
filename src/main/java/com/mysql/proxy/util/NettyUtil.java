package com.mysql.proxy.util;

import java.nio.ByteBuffer;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;

public class NettyUtil {
    
    public static final byte[] AUTH_OK = new byte[] { 7, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0 };
    
    public static ByteBuf toByteBuf(ByteBuffer buffer){
        ByteBuf message=Unpooled.buffer(buffer.limit());
        message.writeBytes(buffer);
        return message;
    }
    
    
    public static ByteBuf toByteBuf(String str){
        byte[] req=str.getBytes();
        ByteBuf message=Unpooled.buffer(req.length);
        message.writeBytes(req);
        return message;
    }
    
    
    public static ByteBuf toByteBuf(byte[] req){
        ByteBuf message=Unpooled.buffer(req.length);
        message.writeBytes(req);
        return message;
    }
    
    
    public static byte[] toBytes(ByteBuf buf){
        if (buf.readableBytes() > 0) {
            byte[] req = new byte[buf.readableBytes()];
            buf.readBytes(req);
            return req;
        }else{
            return new byte[0];
        }
    }

}
