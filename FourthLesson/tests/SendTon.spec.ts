import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { fromNano, toNano } from '@ton/core';
import { SendTon, Withdraw } from '../wrappers/SendTon';
import '@ton/test-utils';

describe('SendTon', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let sendTon: SandboxContract<SendTon>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        sendTon = blockchain.openContract(await SendTon.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await sendTon.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: sendTon.address,
            deploy: true,
            success: true,
        });

        await sendTon.send(
            deployer.getSender(),
            {
                value: toNano('500'),
            }, null
        )
    });

    it('should deploy and recieve ton', async () => {
        const balance = await sendTon.getBalance();
        console.log(balance, "balance is");
        // the check is done inside beforeEach
        // blockchain and sendTon are ready to use
    });

    it('should withdraw message', async () => {
        const message: Withdraw = {
            $$type: 'Withdraw',
            amount: toNano('150')
        }
        const user = await blockchain.treasury('user');
        const balanceBeforeUser = await user.getBalance()

        await sendTon.send(user.getSender(), {
            value: toNano("0.2")
        }, message)

        const balanceAfterUser = await user.getBalance()
        expect(balanceBeforeUser).toBeGreaterThanOrEqual(balanceAfterUser);

        const balanceBeforeDe = await deployer.getBalance()
        await sendTon.send(deployer.getSender(), {
            value: toNano("0.2")
        }, message)

        const balanceAfterDeployer = await deployer.getBalance()
        expect(balanceBeforeDe + toNano("150")).toBeGreaterThanOrEqual(balanceAfterDeployer);
        
        const contractBalance = await sendTon.getBalance()
        expect(contractBalance).toBeGreaterThan(0n);
    })
});
