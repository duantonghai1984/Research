package com.mysql.proxy.codes;

import java.nio.ByteBuffer;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;
import com.mysql.proxy.util.NettyUtil;
import com.seaboat.mysql.protocol.AuthPacket;
import com.seaboat.mysql.protocol.HandshakePacket;
import com.seaboat.mysql.protocol.MysqlMessage;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.MessageToByteEncoder;

public class MySqlPackEnCoder  extends MessageToByteEncoder {
    
    private static final Logger log  = Logger.getLogger(MySqlPackEnCoder.class);
    

    @Override
    protected void encode(ChannelHandlerContext ctx, Object msg, ByteBuf out) throws Exception {
        if(msg instanceof MysqlMessage){
            log.debug("接受到命令报文");
            
        }else if(msg instanceof AuthPacket){
            log.debug("认证报文");
            log.debug(JSON.toJSONString((AuthPacket)msg));
            AuthPacket hs=(AuthPacket)msg;
            ByteBuffer buffer = ByteBuffer.allocate(256);
            hs.write(buffer);
            buffer.flip();
            ctx.writeAndFlush(NettyUtil.toByteBuf(buffer));
        }else if(msg instanceof HandshakePacket){
            HandshakePacket hs = (HandshakePacket)msg;
            ByteBuffer buffer = ByteBuffer.allocate(256);
            hs.write(buffer);
            buffer.flip();
            ctx.writeAndFlush(NettyUtil.toByteBuf(buffer));
        
    }else if(msg instanceof byte[]){
            log.debug("字节报文");
            byte[] data=(byte[])msg;
            log.debug("报文:"+new String(data));
            out.writeBytes(data);
        }else if(msg instanceof ByteBuf){
            ByteBuf buf=(ByteBuf)msg;
            buf.resetReaderIndex();
            log.debug("ByteBuf报文");
            out.writeBytes(buf);
        }else{
            log.debug("不认识的类型"+msg.getClass().getName());
           
        }
    }

}
