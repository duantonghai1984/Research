package com.mysql.proxy.netty.test;

import java.security.NoSuchAlgorithmException;

import com.seaboat.mysql.protocol.AuthPacket;
import com.seaboat.mysql.protocol.Capabilities;
import com.seaboat.mysql.protocol.HandshakePacket;
import com.seaboat.mysql.protocol.util.RandomUtil;
import com.seaboat.mysql.protocol.util.SecurityUtil;

public class MysqlContans {
    
    
    
    
    public static HandshakePacket handshark=null;
    
    
    
    public static AuthPacket buildAuthPack(String user, String pwd,HandshakePacket handshark){
        byte[] rand1 = RandomUtil.randomBytes(8);
        byte[] rand2 = RandomUtil.randomBytes(12);
        byte[] seed = new byte[rand1.length + rand2.length];
        System.arraycopy(rand1, 0, seed, 0, rand1.length);
        System.arraycopy(rand2, 0, seed, rand1.length, rand2.length);

        AuthPacket auth = new AuthPacket();
        auth.packetId = 0;
        if(handshark!=null){
        auth.clientFlags =handshark.serverCapabilities; /*getClientCapabilities()*/;
        auth.charsetIndex=handshark.serverCharsetIndex;
        }
        auth.maxPacketSize = 1024 * 1024 * 16;
      
        auth.user = user;
        try {
            auth.password = SecurityUtil
                    .scramble411(pwd.getBytes(), seed);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        
        return auth;
    }
    
    
    
    public static int getClientCapabilities() {
        int flag = 0;
        //利用mysql4.1.1之后的密码验证方式
        flag |= Capabilities.CLIENT_LONG_PASSWORD;
        //返回发现的行数（匹配的），而不是受影响的行数。
        flag |= Capabilities.CLIENT_FOUND_ROWS;
        //客户端长标识位
        flag |= Capabilities.CLIENT_LONG_FLAG;
        //客户端可以指定DB
        flag |= Capabilities.CLIENT_CONNECT_WITH_DB;
        // flag |= Capabilities.CLIENT_NO_SCHEMA;
       
        //作为ODBC client
        flag |= Capabilities.CLIENT_ODBC;
        //是否可以用Load data命令
        flag |= Capabilities.CLIENT_LOCAL_FILES;
        //客户端忽略'('之前的空格
        flag |= Capabilities.CLIENT_IGNORE_SPACE;
        //是否为新4.1的协议
        flag |= Capabilities.CLIENT_PROTOCOL_41;
        //交互客户端
        flag |= Capabilities.CLIENT_INTERACTIVE;
        //握手之后转为SSL连接
        // flag |= Capabilities.CLIENT_SSL;
        //忽略底层抛出的SIGPIPE信号
        flag |= Capabilities.CLIENT_IGNORE_SIGPIPE;
        //客户端是否支持事务
        flag |= Capabilities.CLIENT_TRANSACTIONS;
        // flag |= Capabilities.CLIENT_RESERVED;
        //是否为新的验证
        flag |= Capabilities.CLIENT_SECURE_CONNECTION;
        // client extension
        flag |= Capabilities.CLIENT_MULTI_STATEMENTS;
        flag |= Capabilities.CLIENT_MULTI_RESULTS;
        return flag;
    }
    

}
