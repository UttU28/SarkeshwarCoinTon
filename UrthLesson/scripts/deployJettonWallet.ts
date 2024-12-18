import { toNano, Address } from '@ton/core';
import { JettonWallet } from '../wrappers/JettonWallet';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const parentAddress = Address.parse('EQAu7WioHXJ3y09s57EMsMR4hGLYYjQ5_2nYAnrIL0LnUmyL'); // Parent address

    // Ensure sender's address is defined
    const sender = provider.sender();
    if (!sender.address) {
        throw new Error('Sender address is undefined. Make sure the provider has a valid sender.');
    }
    const ownerAddress = sender.address;

    // Initialize the JettonWallet with validated addresses
    const jettonWallet = provider.open(await JettonWallet.fromInit(parentAddress, ownerAddress));

    await jettonWallet.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(jettonWallet.address);

    // run methods on `jettonWallet`
}
