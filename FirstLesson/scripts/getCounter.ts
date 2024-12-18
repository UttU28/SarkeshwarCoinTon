import { FirstContract } from '../wrappers/FirstContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const firstContract = provider.open(await FirstContract.fromInit(9022513040n));

    const counter = firstContract.getCounter();
    const id = firstContract.getId();

    console.log('Counter and ID are', counter, id)
    // run methods on `firstContract`
}
