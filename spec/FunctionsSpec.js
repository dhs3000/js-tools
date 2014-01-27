

//dann mm machen

//ClassBase noch mal reimplementieren aber ohne mm zu benutzen


describe("Functions", function() {
  var f = window.Functions;

  describe("isFunction", function() {
	it("Function to be recognized as function", function() {
	    function test() {
	    }

	    expect(f.isFunction(test)).toBeTruthy();
	  });
	  
	  it("Object to be recognized as not-function", function() {
	    var test = {};

	    expect(f.isFunction(test)).toBeFalsy();
	  });
	  
	  it("Undefined to be recognized as not-function", function() {
	    var test = undefined;

	    expect(f.isFunction(test)).toBeFalsy();
	  });
  });
  

  describe("parameterNamesOf", function() {
	it("Parameterless function should have no parameter names", function() {
	  function test() {
	  }
	  
	  expect(f.parameterNamesOf(test)).toEqual([]);
	});
	
	it("One parameter function should have one named parameter", function() {
	  function test(paramA) {
	  }
	  
	  expect(f.parameterNamesOf(test)).toEqual(['paramA']);
	});
	
	it("Two parameter function should have two named parameter", function() {
	  function test(paramA, paramB) {
	  }
	  
	  expect(f.parameterNamesOf(test)).toEqual(['paramA', 'paramB']);
	});
	
	it("Three parameter function should have three named parameter", function() {
	  function test(paramA, paramB, paramC) {
	  }
	  
	  expect(f.parameterNamesOf(test)).toEqual(['paramA', 'paramB', 'paramC']);
	});
	
	
  });
  
  
  
  
  
});