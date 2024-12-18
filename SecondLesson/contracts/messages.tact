import "@stdlib/deploy";

message Add {
    amount: Int as uint32;
}

message Subtract {
    amount: Int as uint32;
}

message MultiMath {
    add: Int as uint32;
    subtract: Int as uint32;
    multiply: Int as uint32;
}

contract Messages with Deployable {
    val: Int as int64;

    init() {
        self.val = 0;
    }

    receive("increment") {
        self.val += 1;
    }

    receive("decrement") {
        self.val -= 1;
    }

    // If not in increment or decrement 
    receive(msg: String) {

    }
}
