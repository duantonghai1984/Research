package com.mysql.proxy.codes;

import java.util.List;

import org.apache.log4j.Logger;

import com.mysql.proxy.util.NettyUtil;
import com.seaboat.mysql.protocol.AuthPacket;
import com.seaboat.mysql.protocol.HandshakePacket;
import com.seaboat.mysql.protocol.MysqlMessage;
import com.seaboat.mysql.protocol.MysqlPacket;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.ByteToMessageDecoder;

public class MySqlPackDeCoder extends ByteToMessageDecoder {
    private static final Logger log  = Logger.getLogger(MySqlPackDeCoder.class);
    
    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf msg, List<Object> out) throws Exception {
        log.warn("decode 报文");
        ByteBuf buf = (ByteBuf) msg;
        if (buf.readableBytes() <= 0) {
            return;
        }
        byte[] data = new byte[buf.readableBytes()];
        buf.readBytes(data);
        Object mm = null;
        switch (data[4])
        {
            case MysqlPacket.COM_INIT_DB:
               /* commands.doInitDB();
                source.initDB(data);*/
                mm = new MysqlMessage(data);
                break;
            case MysqlPacket.COM_QUERY:
                /*commands.doQuery();
                source.query(data);*/
                mm = new MysqlMessage(data);
                break;
            case MysqlPacket.COM_PING:
                /*commands.doPing();
                source.ping();*/
                mm = new MysqlMessage(data);
                break;
            case MysqlPacket.COM_QUIT:
                /*commands.doQuit();
                source.close("quit cmd");*/
                mm = new MysqlMessage(data);
                break;
            case MysqlPacket.COM_PROCESS_KILL:
                /*commands.doKill();
                source.kill(data);*/
                mm = new MysqlMessage(data);
                break;
            case MysqlPacket.COM_STMT_PREPARE:
               /* commands.doStmtPrepare();
                source.stmtPrepare(data);*/
                mm = new MysqlMessage(data);
                break;
            case MysqlPacket.COM_STMT_EXECUTE:
                /*commands.doStmtExecute();
                source.stmtExecute(data);*/
                mm = new MysqlMessage(data);
                break;
            case MysqlPacket.COM_STMT_CLOSE:
                /*commands.doStmtClose();
                source.stmtClose(data);*/
                mm = new MysqlMessage(data);
                break;
            case MysqlPacket.COM_HEARTBEAT:
                /*commands.doHeartbeat();
                source.heartbeat(data);*/
                mm = new MysqlMessage(data);
                break;
            default:
                try{
                AuthPacket auth=new AuthPacket();
                auth.read(data);
                mm=auth;
                break;
                }catch(Exception e){
                    try{
                    HandshakePacket pac=new HandshakePacket();
                    pac.read(data);
                    mm=pac;
                    }catch(Exception e2){
                        mm=null;
                    }
                }
        }
        
        if(mm!=null){
            out.add(mm);
        }else{
            buf.resetReaderIndex();
            byte[] bytes= NettyUtil.toBytes(buf);
            out.add(bytes);
        }
    }
    
    
    public static void main(String[] args){
        
        ByteBuf buf= NettyUtil.toByteBuf("test one");
        
        System.out.println(new String(NettyUtil.toBytes(buf)));
        System.out.println(new String(NettyUtil.toBytes(buf)));
    }

}
