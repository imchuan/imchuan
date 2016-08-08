/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50620
Source Host           : localhost:3306
Source Database       : imc

Target Server Type    : MYSQL
Target Server Version : 50620
File Encoding         : 65001

Date: 2015-12-12 14:54:12
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for cms_article
-- ----------------------------
DROP TABLE IF EXISTS `cms_article`;
CREATE TABLE `cms_article` (
  `id` varchar(50) NOT NULL,
  `article_no` int(11) DEFAULT NULL,
  `author` varchar(50) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `content` text,
  `intro` varchar(500) DEFAULT NULL,
  `tags` varchar(500) DEFAULT NULL,
  `view_count` int(11) DEFAULT NULL,
  `comment_count` int(11) DEFAULT NULL,
  `good_count` int(11) DEFAULT NULL,
  `queue` int(11) DEFAULT NULL,
  `is_top` char(1) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `publish_time` datetime DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `keywords` varchar(300) DEFAULT NULL,
  `page_title` varchar(200) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `article_no` (`article_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cms_article
-- ----------------------------
INSERT INTO `cms_article` VALUES ('40282e81516ac11c01516ac254200000', '1', '木川', 'sdfsdfsdf', 'dsfsdfsdfsdfsdfsdf', 'sdfsdfsdf', 'java', null, null, null, null, '1', 'UNRELEASED', '2015-12-12 10:29:49', 'sdfsdf', 'sdfsdf', 'sdfsdsdf', '2015-12-04 10:11:39', '2015-12-12 10:29:49', null);
INSERT INTO `cms_article` VALUES ('40282e815185d782015185ff36300000', '2', '木川', '结算单开个会结算单开个会结算单开个会结算单开个会', '结算单开个会结算单开个会结算单开个会结算单开个会结算单开个会结算单开个会结算单开个会结算单开个会结算单开个会结算单开个会结算单开个会结算单开个会结算单开个会', '结算单开个会结算单开个会结算单开个会结算单开个会结算单开个会结算单开个会结算单开个会结算单开个会', null, null, null, null, null, '1', 'NEW', null, null, null, null, '2015-12-09 17:07:54', '2015-12-09 17:07:54', null);
INSERT INTO `cms_article` VALUES ('40282e815190300b015190313b730000', '3', '木川', '111111', 'sdfsdfsdfsdsdsdds', '1111', '40282e815167b310015167c0db680002', null, null, null, null, '1', 'UNRELEASED', '2015-12-11 16:38:44', '2223222', '111233', '111', '2015-12-11 16:38:44', '2015-12-11 16:38:44', null);

-- ----------------------------
-- Table structure for cms_category
-- ----------------------------
DROP TABLE IF EXISTS `cms_category`;
CREATE TABLE `cms_category` (
  `id` varchar(50) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `url` varchar(200) DEFAULT NULL,
  `queue` int(11) DEFAULT NULL,
  `parent_id` varchar(50) DEFAULT NULL,
  `parent_name` varchar(50) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cms_category
-- ----------------------------
INSERT INTO `cms_category` VALUES ('40282e815158125b015158135e500000', 'navigation', '导航栏', null, null, null, null, '2015-11-30 19:07:23', '2015-11-30 19:07:23', null);
INSERT INTO `cms_category` VALUES ('40282e815158125b0151581441f50001', 'java', 'Java', null, '1', '40282e815158125b015158135e500000', '导航栏', '2015-11-30 19:08:21', '2015-11-30 19:08:21', null);
INSERT INTO `cms_category` VALUES ('40282e815166756c015166a64fd60000', 'db', '数据库', null, '3', '40282e815158125b015158135e500000', '导航栏', '2015-12-03 15:02:34', '2015-12-12 11:21:47', null);
INSERT INTO `cms_category` VALUES ('40282e81519428d30151942aff190000', 'js', 'JavaScript', null, '2', '40282e815158125b015158135e500000', '导航栏', '2015-12-12 11:10:24', '2015-12-12 11:10:24', null);
INSERT INTO `cms_category` VALUES ('40282e81519428d30151942db95a0001', 'fw', '开源框架', null, '4', '40282e815158125b015158135e500000', '导航栏', '2015-12-12 11:13:23', '2015-12-12 11:21:57', '开源框架');
INSERT INTO `cms_category` VALUES ('40282e81519428d30151942eaaa20002', 'os', '操作系统', null, '5', '40282e815158125b015158135e500000', '导航栏', '2015-12-12 11:14:25', '2015-12-12 11:22:03', '操作系统');
INSERT INTO `cms_category` VALUES ('40282e81519428d301519432e69f0003', 'it', 'IT资讯', null, '6', '40282e815158125b015158135e500000', '导航栏', '2015-12-12 11:19:02', '2015-12-12 11:22:09', 'IT资讯');
INSERT INTO `cms_category` VALUES ('40282e81519428d30151943549130004', 'about', '关于博主', '/about', '6', '40282e815158125b015158135e500000', '导航栏', '2015-12-12 11:21:38', '2015-12-12 11:41:13', null);
INSERT INTO `cms_category` VALUES ('40282e81519428d301519437241f0005', 'lm', '在线留言', '/lm', '8', '40282e815158125b015158135e500000', '导航栏', '2015-12-12 11:23:40', '2015-12-12 11:41:32', null);
INSERT INTO `cms_category` VALUES ('40282e81519428d301519437bb570006', 'mysql', 'MySql', null, '1', '40282e815166756c015166a64fd60000', '数据库', '2015-12-12 11:24:19', '2015-12-12 11:24:19', null);
INSERT INTO `cms_category` VALUES ('40282e81519428d3015194383b200007', 'spring', 'spring', null, '1', '40282e81519428d30151942db95a0001', '开源框架', '2015-12-12 11:24:51', '2015-12-12 11:24:51', null);
INSERT INTO `cms_category` VALUES ('40282e81519428d30151943878f70008', 'hibernate', 'hibernate', null, '2', '40282e81519428d30151942db95a0001', '开源框架', '2015-12-12 11:25:07', '2015-12-12 11:25:07', null);
INSERT INTO `cms_category` VALUES ('40282e81519428d301519438b6cf0009', 'mybatis', 'mybatis', null, '3', '40282e81519428d30151942db95a0001', '开源框架', '2015-12-12 11:25:23', '2015-12-12 11:25:23', null);
INSERT INTO `cms_category` VALUES ('40282e81519428d301519438e651000a', 'linux', 'linux', null, '1', '40282e81519428d30151942eaaa20002', '操作系统', '2015-12-12 11:25:35', '2015-12-12 11:25:35', null);
INSERT INTO `cms_category` VALUES ('40282e81519428d3015194395f9d000b', 'jquery', 'jquery', null, '1', '40282e81519428d30151942aff190000', 'JavaScript', '2015-12-12 11:26:06', '2015-12-12 11:26:06', null);
INSERT INTO `cms_category` VALUES ('40282e81519428d301519439a15f000c', 'ng', 'angularjs', null, '2', '40282e81519428d30151942aff190000', 'JavaScript', '2015-12-12 11:26:23', '2015-12-12 11:26:23', null);

-- ----------------------------
-- Table structure for cms_category_article
-- ----------------------------
DROP TABLE IF EXISTS `cms_category_article`;
CREATE TABLE `cms_category_article` (
  `category_id` varchar(50) NOT NULL,
  `article_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cms_category_article
-- ----------------------------
INSERT INTO `cms_category_article` VALUES ('40282e815158125b0151581441f50001', '40282e815185d782015185ff36300000');
INSERT INTO `cms_category_article` VALUES ('40282e815166756c015166a64fd60000', '40282e815190300b015190313b730000');
INSERT INTO `cms_category_article` VALUES ('40282e815166756c015166a64fd60000', '40282e81516ac11c01516ac254200000');

-- ----------------------------
-- Table structure for cms_feedback
-- ----------------------------
DROP TABLE IF EXISTS `cms_feedback`;
CREATE TABLE `cms_feedback` (
  `id` varchar(50) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `content` varchar(500) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `reply_time` datetime DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cms_feedback
-- ----------------------------

-- ----------------------------
-- Table structure for cms_friend_link
-- ----------------------------
DROP TABLE IF EXISTS `cms_friend_link`;
CREATE TABLE `cms_friend_link` (
  `id` varchar(50) NOT NULL,
  `url` varchar(200) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `proposer_email` varchar(100) DEFAULT NULL,
  `logo_url` varchar(200) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cms_friend_link
-- ----------------------------

-- ----------------------------
-- Table structure for cms_tags
-- ----------------------------
DROP TABLE IF EXISTS `cms_tags`;
CREATE TABLE `cms_tags` (
  `id` varchar(50) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cms_tags
-- ----------------------------
INSERT INTO `cms_tags` VALUES ('40282e815167b310015167c0db680002', 'java', '2015-12-03 20:11:11', '2015-12-03 20:11:11', null);
INSERT INTO `cms_tags` VALUES ('40282e815167b310015167c0db730003', '泛型', '2015-12-03 20:11:11', '2015-12-03 20:11:11', null);
INSERT INTO `cms_tags` VALUES ('40282e815190300b015190313b840001', '40282e815167b310015167c0db680002', '2015-12-11 16:38:44', '2015-12-11 16:38:44', null);

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
  `id` varchar(50) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `url` varchar(200) DEFAULT NULL,
  `queue` int(11) DEFAULT NULL,
  `parent_id` varchar(50) DEFAULT NULL,
  `parent_name` varchar(50) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES ('40282e815129607001512962dbbe0001', '系统菜单', null, null, null, null, '2015-11-21 17:32:03', '2015-11-21 17:32:03', null);
INSERT INTO `sys_menu` VALUES ('40282e815156618701515663648f0000', '系统管理', null, '1', '40282e815129607001512962dbbe0001', '系统菜单', '2015-11-30 11:15:33', '2015-11-30 11:15:33', null);
INSERT INTO `sys_menu` VALUES ('40282e8151566187015156639cc20001', '用户管理', '/sys/user/list', '1', '40282e815156618701515663648f0000', '系统管理', '2015-11-30 11:15:47', '2015-11-30 18:53:09', null);
INSERT INTO `sys_menu` VALUES ('40282e815156618701515663d61b0002', '菜单管理', '/sys/menu/list', '2', '40282e815156618701515663648f0000', '系统管理', '2015-11-30 11:16:02', '2015-11-30 18:53:18', null);
INSERT INTO `sys_menu` VALUES ('40282e81515661870151566423650003', '资源管理', 'sys/resource/list', '3', '40282e815156618701515663648f0000', '系统管理', '2015-11-30 11:16:21', '2015-11-30 18:53:29', null);
INSERT INTO `sys_menu` VALUES ('40282e8151566187015156644dc30004', '权限管理', null, '2', '40282e815129607001512962dbbe0001', '系统菜单', '2015-11-30 11:16:32', '2015-11-30 11:16:32', null);
INSERT INTO `sys_menu` VALUES ('40282e815156618701515665596a0005', '菜单权限管理', '/sys/role/roleMenuIndex', '1', '40282e8151566187015156644dc30004', '权限管理', '2015-11-30 11:17:41', '2015-11-30 18:53:35', null);
INSERT INTO `sys_menu` VALUES ('40282e815156618701515665fa180006', '资源权限管理', null, '2', '40282e8151566187015156644dc30004', '权限管理', '2015-11-30 11:18:22', '2015-11-30 11:18:22', null);
INSERT INTO `sys_menu` VALUES ('40282e815157fe6f015157ff81af0000', '内容管理', null, '3', '40282e815129607001512962dbbe0001', '系统菜单', '2015-11-30 18:45:41', '2015-11-30 18:45:41', null);
INSERT INTO `sys_menu` VALUES ('40282e815157fe6f015157ffe1520001', '栏目管理', '/cms/category/list', '1', '40282e815157fe6f015157ff81af0000', '内容管理', '2015-11-30 18:46:05', '2015-11-30 18:46:05', null);
INSERT INTO `sys_menu` VALUES ('40282e81516ac11c01516ba5bce80001', '文章管理', '/cms/article/list', '2', '40282e815157fe6f015157ff81af0000', '内容管理', '2015-12-04 14:20:02', '2015-12-04 14:25:36', null);

-- ----------------------------
-- Table structure for sys_menu_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu_role`;
CREATE TABLE `sys_menu_role` (
  `menu_id` varchar(50) NOT NULL,
  `role_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_menu_role
-- ----------------------------
INSERT INTO `sys_menu_role` VALUES ('40282e81515661870151566423650003', '40282e815128ff8b015129029f340003');
INSERT INTO `sys_menu_role` VALUES ('40282e815156618701515665fa180006', '40282e815128ff8b015129029f340003');
INSERT INTO `sys_menu_role` VALUES ('40282e815156618701515665596a0005', '40282e815128ff8b015129029f340003');
INSERT INTO `sys_menu_role` VALUES ('40282e815157fe6f015157ffe1520001', '40282e815128ff8b015129029f340003');
INSERT INTO `sys_menu_role` VALUES ('40282e815157fe6f015157ff81af0000', '40282e815128ff8b015129029f340003');
INSERT INTO `sys_menu_role` VALUES ('40282e815156618701515663648f0000', '40282e815128ff8b015129029f340003');
INSERT INTO `sys_menu_role` VALUES ('40282e8151566187015156644dc30004', '40282e815128ff8b015129029f340003');
INSERT INTO `sys_menu_role` VALUES ('40282e815129607001512962dbbe0001', '40282e815128ff8b015129029f340003');
INSERT INTO `sys_menu_role` VALUES ('40282e815156618701515663d61b0002', '40282e815128ff8b015129029f340003');
INSERT INTO `sys_menu_role` VALUES ('40282e8151566187015156639cc20001', '40282e815128ff8b015129029f340003');
INSERT INTO `sys_menu_role` VALUES ('40282e81516ac11c01516ba5bce80001', '40282e815128ff8b015129029f340003');

-- ----------------------------
-- Table structure for sys_resource
-- ----------------------------
DROP TABLE IF EXISTS `sys_resource`;
CREATE TABLE `sys_resource` (
  `id` varchar(50) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `url` varchar(200) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_resource
-- ----------------------------

-- ----------------------------
-- Table structure for sys_resource_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_resource_role`;
CREATE TABLE `sys_resource_role` (
  `resource_id` varchar(50) NOT NULL,
  `role_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_resource_role
-- ----------------------------

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` varchar(50) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES ('40282e815128ff8b015129029f340003', '管理员', 'ROLE_ADMIN', '2015-11-21 15:46:56', '2015-12-04 14:20:22', '管理员');
INSERT INTO `sys_role` VALUES ('40282e815128ff8b01512902be6e0004', 'CMS编辑部', 'ROLE_CMS', '2015-11-21 15:47:04', '2015-11-21 15:47:04', 'CMS编辑部');

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` varchar(50) NOT NULL,
  `user_name` varchar(50) DEFAULT NULL COMMENT '用户名',
  `password` varchar(150) DEFAULT NULL COMMENT '密码',
  `email` varchar(30) DEFAULT NULL COMMENT '邮箱',
  `mobile` varchar(20) DEFAULT NULL,
  `last_login_time` datetime DEFAULT NULL,
  `nick_name` varchar(50) DEFAULT NULL,
  `login_ip` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT '0' COMMENT '0-正常；1-禁用',
  `created_time` datetime DEFAULT NULL,
  `modified_time` datetime DEFAULT NULL,
  `remark` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES ('40282e815133a77b015133a870df0000', 'admin', '96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e', 'muchuanj@163.com', '18705928704', '2015-12-12 11:42:40', '木川', '127.0.0.1', 'NORMAL', '2015-11-23 17:24:15', '2015-12-12 11:42:40', '管理员');

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
  `user_id` varchar(50) NOT NULL,
  `role_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES ('40282e815133a77b015133a870df0000', '40282e815128ff8b015129029f340003');
