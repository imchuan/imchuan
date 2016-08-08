package com.imchuan.service;

import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * @author liuqq
 * @email muchuanj@163.com
 * @date 2015-11-11 14:34
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath*:/imchuan-spring-test.xml")
public abstract class BaseTest extends AbstractJUnit4SpringContextTests {
}
