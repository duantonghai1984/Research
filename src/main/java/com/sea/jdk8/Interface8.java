package com.sea.jdk8;

public interface Interface8 {

	double calculate(int a);
	
    default double sqrt(int a) {
        return Math.sqrt(a);
    }
    
    default double sqrt2(int a) {
        return Math.sqrt(a);
    }
    
}
