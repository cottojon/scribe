import createSubscriber from 'pg-listen';
const databaseURL = 'postgres://postgres:Motorcycle3232!@localhost:5432/scribe';
 
// Accepts the same connection config object that the "pg" package would take
const subscriber = createSubscriber({ connectionString: databaseURL });
 
subscriber.notifications.on("my-channel", (payload) => {
  // Payload as passed to subscriber.notify() (see below)
  console.log("Received notification in 'my-channel':", payload)
})
 
subscriber.events.on("error", (error) => {
  console.error("Fatal database connection error:", error)
  process.exit(1)
})
 
process.on("exit", () => {
  subscriber.close()
})
 
export async function connect () {
  await subscriber.connect()
  await subscriber.listenTo("my-channel")
}


//export async function sendSampleMessage () {
  //await subscriber.notify({
    //greeting: "Hey, buddy.",
    //timestamp: Date.now()
  //})
/}