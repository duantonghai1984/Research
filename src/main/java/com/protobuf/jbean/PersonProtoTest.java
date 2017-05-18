package com.protobuf.jbean;

import org.junit.Test;

import com.google.protobuf.InvalidProtocolBufferException;
import com.protobuf.jbean.PersonProto.Person;

public class PersonProtoTest {
	
	@Test
    public void testSerialize() {
        PersonProto.Person.Builder builder = PersonProto.Person.newBuilder();
        PersonProto.Person.getDefaultInstance();
        builder.setAge(23);
        builder.setBirthday("2016-11-23");
        builder.setName("ghost");
        builder.setMan(true);
      

        Person person = builder.build();
        System.out.println(person.toString());
    }
	
	
	   @Test
	    public void testDeserialize() throws InvalidProtocolBufferException {
	        PersonProto.Person.Builder builder = PersonProto.Person.newBuilder();
	        builder.setAge(23);
	        builder.setBirthday("2016-12-23");
	        builder.setName("ghostman");
	        builder.setMan(true);

	        Person person = builder.build();
	        Person newPerson = Person.parseFrom(person.toByteArray());
	        System.out.println(newPerson.toString());
	    }

}
