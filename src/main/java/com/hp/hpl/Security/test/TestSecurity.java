package com.hp.hpl.Security.test;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

import com.hp.hpl.Security.PasswordSecurityManager;

public class TestSecurity {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		try {
			System.setSecurityManager(new PasswordSecurityManager("123456"));
		} catch (SecurityException se) {
			System.out.println("SecurityManager already set!");
		}
		try {

			BufferedReader fis = new BufferedReader(new FileReader("input.txt"));
		
			BufferedWriter fos = new BufferedWriter(
					new FileWriter("output.txt"));
			String inputString;
			while ((inputString = fis.readLine()) != null) {
				fos.write(inputString);
				fos.write('\n');
			}
			fis.close();
			fos.close();
		} catch (IOException ioe) {
			System.out.println("I/O failed for SecurityManagerTest.");
		} catch (Exception e) {
			System.out.println(e.toString());
		}

	}

}
