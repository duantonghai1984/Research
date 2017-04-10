package com.hp.hpl.annotation;

import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.processing.AbstractProcessor;
import javax.annotation.processing.ProcessingEnvironment;
import javax.annotation.processing.RoundEnvironment;
import javax.annotation.processing.SupportedAnnotationTypes;
import javax.annotation.processing.SupportedSourceVersion;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.AnnotationMirror;
import javax.lang.model.element.AnnotationValue;
import javax.lang.model.element.Element;
import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.TypeElement;
import javax.lang.model.util.Elements;

@SupportedSourceVersion(SourceVersion.RELEASE_6)
@SupportedAnnotationTypes("annotation.Assignment")
public class Assiagment extends AbstractProcessor  {

	 private TypeElement assignmentElement; 
	 
	@Override
	public synchronized void init(ProcessingEnvironment processingEnv) {
		super.init(processingEnv);
        Elements elementUtils = processingEnv.getElementUtils();
        assignmentElement = elementUtils.getTypeElement("annotation.Assignment");
	}

	@Override
	public boolean process(Set<? extends TypeElement> annotations,
			RoundEnvironment roundEnv) {
		Set<? extends Element> elements = roundEnv.getElementsAnnotatedWith(assignmentElement);
        for (Element element : elements) {
            processAssignment(element);
        }
        return true;
	} 
	
	
	 private void processAssignment(Element element) {
	        List<? extends AnnotationMirror> annotations = element.getAnnotationMirrors();
	        for (AnnotationMirror mirror : annotations) {
	            /*if (mirror.getAnnotationType().asElement().equals(assignmentElement)) {
	                Map<? extends ExecutableElement, ? extends AnnotationValue> values = mirror.getElementValues();
	                String assignee = (String) getAnnotationValue(values, "assignee"); //获取注解的值
	            }*/
	        }
	    } 
   
}
