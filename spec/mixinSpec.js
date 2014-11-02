
describe("mixin", function() {

    it("mixes an array of objects togethger", function() {
        var a = {a: 23},
            b = {b: 24},
            result = mixin(a, b);

            expect(a.a).toBeDefined();
            expect(a.b).toBeUndefined();
            expect(b.a).toBeUndefined();
            expect(b.b).toBeDefined();

            expect(result.a).toBeDefined();
            expect(result.b).toBeDefined();
    });

    it("mixes a class and an object togethger", function() {
        function A(name) {
            this.name;
        }
        A.prototype.describe = function(){
            return "I am " + this.name;
        };

        var withAge = {
                age: 24
            },
            result = mixin(A, withAge);

            expect(result.describe).toBeDefined();
            expect(result.name).toBeUndefined();

            expect(result.age).toBeDefined();
    });

    it("can use a mixin of objects as prototype for a class", function() {


        var describable = {
            describe: function(){
                return "I am " + this.name;
            }
        };

        function Person(name) {
            this.name = name;
        }
        Person.prototype = mixin(describable);

        expect(Person.prototype.describe).toBeDefined();

        var person = new Person("Hans");

        expect(person.describe).toBeDefined();
        expect(person.describe()).toEqual("I am Hans");

    });

    it("can use a mixin of another class as prototype for a class", function() {


        function Describable() {
        }
        Describable.prototype = {
            describe: function(){
                return "I am " + this.name;
            }
        };

        function Person(name) {
            this.name = name;
        }
        Person.prototype = mixin(Describable);

        expect(Person.prototype.describe).toBeDefined();

        var person = new Person("Hans");

        expect(person.describe).toBeDefined();
        expect(person.describe()).toEqual("I am Hans");

    });

    it("can check if an abstract method is implemented", function() {
        var describable = {
            name: mixin.abstract,

            describe: function(){
                return "I am " + this.name;
            }
        };

        function Person(name) {
            this._name = name;
        }

        function mixinWithImplementedMethod() {
            Person.prototype = mixin(describable, {
                name: function() {
                    return this._name;
                }
            });
        }

        expect(mixinWithImplementedMethod).not.toThrow();

        function mixinWithNotImplementedMethod() {
            Person.prototype = mixin(describable, {
                fullname: function() {
                    return this._name;
                }
            });
        }

        expect(mixinWithNotImplementedMethod).toThrow();
    });

    // use scoped for private helper methods. Note: not for private data.

});
