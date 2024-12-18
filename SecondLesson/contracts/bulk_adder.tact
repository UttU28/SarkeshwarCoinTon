import "@stdlib/deploy";

message Reach {
    counter: Address;
    target: Int as uint32;
}

message CounterValue {
    amount: Int as uint32;
}


contract BulkAdder with Deployable {

    target: Int as uint32;
    init() {
        self.target = 0;
    }

    receive(msg: Reach) {
        require(msg.target <=10, "Target can't be more than 10");
        self.target = msg.target;
        send(SendParameters{
            to: msg.counter,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            body: "query".asComment()
        });
    }

    receive(msg: CounterValue){
        if(self.target > msg.amount){
            send(SendParameters{
                to: sender(),
                value: 0,
                mode: SendRemainingValue + SendIgnoreErrors,
                body: "increment".asComment()
            });
        }
    }
}
