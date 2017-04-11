/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2014 All Rights Reserved.
 */
package com.david.common.test;

import com.david.common.rpc.RpcService;

/**
 *
 * @author zhangwei_david
 * @version $Id: HelloServiceImpl.java, v 0.1 2014年12月31日 下午9:28:02 zhangwei_david Exp $
 */
@RpcService(value = "helloService", inf = HelloService.class)
public class HelloServiceImpl implements HelloService {

    public String hello() {
        return "Hello! ";
    }
}
