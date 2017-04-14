package com.mysql.proxy.app;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;



public class MysqlPoxyServerTest {

 
    public static void main(String[] args) {
        Connection con=null;
        try{
        Class.forName("com.mysql.jdbc.Driver").newInstance();  
         con = DriverManager.getConnection("jdbc:mysql://localhost:3306",  
                "root", "root"); 
         
         System.out.println("connect over");
         
         Statement statement=  con.createStatement();
         statement.executeQuery("select * from table");
        
        }catch(Exception e){
            e.printStackTrace();
        }
    }

}
