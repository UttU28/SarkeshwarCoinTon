import "@stdlib/deploy";
import "./messages.tact";
import "./jetton_wallet.tact";

struct Metadata{
    symbol: String;
    totalSupply: Int;
}

contract JettonMaster with Deployable {

    symbol: String;
    totalSupply: Int as coins;

    init() {
        self.symbol = "TON321";
        self.totalSupply = ton("500");
        self.mint(self.totalSupply, sender());
    }

    fun mint(amount: Int, to: Address) {
        let init: StateInit = initOf JettonWallet(myAddress(), to);
        send(SendParameters{
            to: contractAddress(init),
            body: InternalAdd{amount: amount, origin: myAddress()}.toCell(),
            value: ton("0.03"),
            mode: SendIgnoreErrors,
            code: init.code,
            data: init.data, 
        });
    }

    get fun walletAddress(owner: Address): Address {
        let init: StateInit = initOf JettonWallet(myAddress(), owner);
        return contractAddress(init);
    }

    get fun metadata(): Metadata {
        return Metadata{symbol: self.symbol, totalSupply: self.totalSupply};
    }
}
