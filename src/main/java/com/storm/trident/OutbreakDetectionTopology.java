package com.storm.trident;

import org.apache.storm.generated.StormTopology;
import org.apache.storm.trident.Stream;
import org.apache.storm.trident.TridentTopology;
import org.apache.storm.tuple.Fields;

public class OutbreakDetectionTopology {
    
    
    public static StormTopology buildTopology(){
        TridentTopology topology=new TridentTopology();
        DiagnosisEventSpout spout=new DiagnosisEventSpout();
        
        Stream inputStream=topology.newStream("event", spout);
        
        inputStream.each(new Fields("event"), new DiseaseFilter())
        
        .each(new Fields("event"), new CityAssignment(), new Fields("city"))
        
        .each(new Fields("event","city"), new HourAssignment(),new Fields("hour","cityDiseaseHour"))
    
        .groupBy(new Fields("cityDiseaseHour"));
        
        
        
        return null;
    
    }
    

    public static void main(String[] args) {
       

    }

}
