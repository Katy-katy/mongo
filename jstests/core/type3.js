// Check query type bracketing SERVER-3222

t = db.jstests_type3;
t.drop();

t.ensureIndex( {a:1} );

// Type Object
t.save( {a:{'':''}} );
assert.eq( 1, t.find( {a:{$type:3}} ).hint( {a:1} ).itcount() );

// Type Array
t.remove({});
t.save( {a:[['c']]} );
assert.eq( 1, t.find( {a:{$type:4}} ).hint( {a:1} ).itcount() );

// Type RegEx
t.remove({});
t.save( {a:/r/} );
assert.eq( 1, t.find( {a:{$type:11}} ).hint( {a:1} ).itcount() );

// Type jstNULL
t.remove({});
t.save( {a:null} );
assert.eq( 1, t.find( {a:{$type:10}} ).hint( {a:1} ).itcount() );

// Type Undefined
t.remove({});
t.save( {a:undefined} );
assert.eq( 1, t.find( {a:{$type:6}} ).hint( {a:1} ).itcount() );

// This one won't be returned.
t.save( {a:null} );
assert.eq( 1, t.find( {a:{$type:6}} ).hint( {a:1} ).itcount() );

// Type Code
t.remove({});
t.save( {a:function(){var a = 0;}} );
assert.eq( 1, t.find( {a:{$type:13}} ).itcount() );

// Type BinData
t.remove({});
t.save( {a:new BinData(0,'')} );
assert.eq( 1, t.find( {a:{$type:5}} ).itcount() );

// Type Timestamp
t.remove({});
t.save( {a:new Timestamp()} );
assert.eq( 1, t.find( {a:{$type:17}} ).itcount() );
if ( 0 ) { // SERVER-3304
assert.eq( 0, t.find( {a:{$type:9}} ).itcount() );
}

// Due to SERVER-3304 we need to restart with a completely clean index with no possible traces of
// the Timestamp before inserting the Date.
t.drop();
t.ensureIndex({a:1});

// Type Date
t.remove({});
t.save( {a:new Date()} );
if ( 0 ) { // SERVER-3304
assert.eq( 0, t.find( {a:{$type:17}} ).itcount() );
}
assert.eq( 1, t.find( {a:{$type:9}} ).itcount() );
