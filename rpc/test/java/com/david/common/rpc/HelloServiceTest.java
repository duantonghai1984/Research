/**
 * Alipay.com Inc.
 * Copyright (c) 2004-2014 All Rights Reserved.
 */
package com.david.common.rpc;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.david.common.rpc.proxy.RpcProxyFactory;
import com.david.common.test.HelloService;

/**
 *
 * @author zhangwei_david
 * @version $Id: MyTest.java, v 0.1 2014年12月31日 下午9:25:49 zhangwei_david Exp $
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:client.xml")
public class HelloServiceTest {

    @Autowired
    private RpcProxyFactory rpcProxy;

    @Test
    public void helloTest() {
        HelloService helloService = rpcProxy.create(HelloService.class);
        String result = helloService.hello();
        Assert.assertEquals("Hello! ", result);
    }
}
