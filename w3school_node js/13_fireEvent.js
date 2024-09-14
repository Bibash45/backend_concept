import events from "events";
let eventEmitter = new events.EventEmitter();

// creating event handler
const handleEvent1 = () => {
  console.log(`I an event1`);
};
const handleEvent2 = () => {
  console.log(`I an hello`);
};

// assign the eventhandler to an event

eventEmitter.on("scream", handleEvent1);
eventEmitter.on("hello", handleEvent2);

// fire the 'scream' event
eventEmitter.emit("scream");

// fire the 'hello' event
eventEmitter.emit('hello')