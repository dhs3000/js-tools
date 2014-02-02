
describe("ClassBase", function() {
	var CB = window.ClassBase;

	describe("extend", function() {

		// tests mit und ohne init und super aufrufen...

		it("New subclass object is instance of ClassBase / super class", function() {
			var SUPER = CB.extend({});
			var SUB = SUPER.extend({});

			var s = new SUB();

			expect(s).toBeInstanceOf(SUB);
			expect(s).toBeInstanceOf(SUPER);
			expect(s).toBeInstanceOf(CB);
			
			
		});

		it("New class has expected methods", function() {
			var SUB = CB.extend({
			    init : function(name) {
				    this.name = name;
			    },

			    getName : function() {
				    return this.name;
			    }
			});

			var s = new SUB('NEW');

			expect(s.getName()).toEqual("NEW");
		});
		
		it("New subclass can call superConstructor", function() {
			var SUPER = CB.extend({
			    init : function(name) {
				    this.name = name;
			    }
			});
			
			var SUB = SUPER.extend({
				init: function(name, age) {
					this.superConstructor(name);
					this.age = age;
				}
			});

			var s = new SUB('NEW', 3);

			expect(s.name).toEqual("NEW");
			expect(s.age).toEqual(3);
		});
		
		it("New subclass without own init calls superConstructor automatically", function() {
			var SUPER = CB.extend({
			    init : function(name) {
				    this.name = name;
			    }
			});
			
			var SUB = SUPER.extend({
				getName: function() {
					return this.name;
				}
			});

			var s = new SUB('NEW');

			expect(s.name).toEqual("NEW");
			expect(s.getName()).toEqual("NEW");
		});
		
		it("New subclass can call super method", function() {
			var SUPER = CB.extend({
			    init : function(name) {
				    this.name = name;
			    },

				append: function(text) {
					return text + this.name;
				}
			});
			
			var SUB = SUPER.extend({
				append: function(text) {
					var result = this.superMethod('append', text);
					return result + text;
				}
			});

			var s = new SUB('NAME');

			expect(s.append('X')).toEqual("XNAMEX");
		});
		

		it("New subclass can't call unknown super method", function() {
			var SUPER = CB.extend({});
			
			var SUB = SUPER.extend({
				test: function() {
					this.superMethod('not_existing');
				}
			});

			var s = new SUB();

			expect(function() {s.test(); }).toThrow(new Error("Can't find super method 'not_existing'!"));
		});

		
		it("Should be possible to use superConstructor and superMethod in a subclass", function() {
			var Named = ClassBase.extend({
			    init : function(name) {
				    this.name = name;
			    },
			    
			    describe: function() {
			    	return "I call myself a " + this.name;
			    }
			    
			    
			});
			
			var AgingNamed = Named.extend({
				init: function(name, age) {
					this.superConstructor(name);
					this.age = age;
				},
				
				describe: function() {
					return this.superMethod('describe') + " and I am already " + this.age + " years old!";
				}
			});
			
			var someOne = new AgingNamed('Hans-Wurst', 19);

			expect(someOne.name).toEqual('Hans-Wurst');
			expect(someOne.age).toEqual(19);

			expect(someOne.describe()).toEqual('I call myself a Hans-Wurst and I am already 19 years old!');
		});
		
	});

});