module.exports = class Queue{
    constructor() {
        this.queue = [];
    }
    enqueue(item){
        this.queue.push(item);
    }
    dequeue(){
        if(this.isEmpty()){
            throw new Error("Queue is empty");
        }
        const item = this.queue[0];
        console.log("dequeue", item);
        this.queue = this.queue.slice(1, this.queue.length);
        return item;
    }
    peek(){
        return this.queue[0];
    }
    isEmpty(){
        return this.queue.length === 0;
    }
}
