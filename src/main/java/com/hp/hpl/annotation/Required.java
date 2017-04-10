package com.hp.hpl.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author duantonghai
 *
 */
@Retention(RetentionPolicy.RUNTIME)
@Target( { ElementType.FIELD})
public @interface Required {
	//only work for String field
    int maxLength() default -1;
    int minLength() default -1;
}
