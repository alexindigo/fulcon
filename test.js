var tape   = require('tape')
  , fulcon = require('./')
  ;

tape.test('creates function with no arguments if source function has no arguments', function(t)
{
  t.plan(6);

  var original = function() { return 42; }
    , cloned   = fulcon(original)
    ;

  t.equal(original.length, 0, 'signature of the original function has no arguments');
  t.equal(cloned.length, 0, 'signature of the cloned function has no arguments');
  t.notEqual(original, cloned, 'original and cloned functions are not the same');

  t.equal(original(), cloned(), 'cloned and original functions returns same result');

  original.mark1 = true;
  cloned.mark2   = true;

  t.notOk('mark1' in cloned, 'clone does not have newly assigned properties of the original function');
  t.notOk('mark2' in original, 'original does not have newly assigned properties of the cloned function');
});

tape.test('creates function with few arguments if source function has few arguments', function(t)
{
  t.plan(6);

  var original = function(a, b, c) { return 42 + a + b + c; }
    , cloned   = fulcon(original)
    ;

  t.equal(original.length, 3, 'signature of the original function has 3 arguments');
  t.equal(cloned.length, 3, 'signature of the cloned function has 3 arguments');
  t.notEqual(original, cloned, 'original and cloned functions are not the same');

  t.equal(original(1, 3, 5), cloned(1, 3, 5), 'cloned and original functions returns same result from the same input');

  original.mark1 = true;
  cloned.mark2   = true;

  t.notOk('mark1' in cloned, 'clone does not have newly assigned properties of the original function');
  t.notOk('mark2' in original, 'original does not have newly assigned properties of the cloned function');
});

tape.test('executes original function, so it has same side-effects', function(t)
{
  t.plan(6);

  var counter  = 0
    , original = function(a) { return counter += a; }
    , cloned   = fulcon(original)
    , originalResult
    , clonedResult
    ;

  t.equal(original.length, 1, 'signature of the original function has 1 argument');
  t.equal(cloned.length, 1, 'signature of the cloned function has 1 argument1');
  t.notEqual(original, cloned, 'original and cloned functions are not the same');

  originalResult = original(1);
  t.equal(originalResult, counter, 'original function produces side effects');

  clonedResult = cloned(1);
  t.equal(clonedResult, counter, 'cloned function produces same side effects');

  t.notEqual(originalResult, clonedResult, 'cloned and original functions returns different results from the same input');
});

tape.test('executes original function with same context as cloned', function(t)
{
  t.plan(5);

  var original = function(a, b) { return this.blah + a + b; }
    , cloned   = fulcon(original)
    , context  = {blah: 42}
    ;

  t.equal(original.length, 2, 'signature of the original function has 2 arguments');
  t.equal(cloned.length, 2, 'signature of the cloned function has 2 arguments');
  t.notEqual(original, cloned, 'original and cloned functions are not the same');

  t.equal(original.call(context, 4, 8), 54, 'original function returns same result from the same input and same context');
  t.equal(cloned.call(context, 4, 8), 54, 'cloned function returns same result from the same input and same context');
});

tape.test('executes original function within bound context', function(t)
{
  t.plan(5);

  var original = function(a, b) { return this.blah + a + b; }.bind({blah: 5})
    , cloned   = fulcon(original)
    , context  = {blah: 42}
    ;

  t.equal(original.length, 2, 'signature of the original function has 2 arguments');
  t.equal(cloned.length, 2, 'signature of the cloned function has 2 arguments');
  t.notEqual(original, cloned, 'original and cloned functions are not the same');

  t.equal(original.call(context, 4, 8), 17, 'original function returns same result from the same input and bound context');
  t.equal(cloned.call(context, 4, 8), 17, 'cloned function returns same result from the same input and bound context');
});
