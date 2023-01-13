package txscaling.approach5.txcreation.contracts;

import io.reactivex.Flowable;
import io.reactivex.functions.Function;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Int256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.BaseEventResponse;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the 
 * <a href="https://github.com/web3j/web3j/tree/master/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 1.4.1.
 */
@SuppressWarnings("rawtypes")
public class DappBackend extends Contract {
    public static final String BINARY = "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073e7a00277408c45ff7755cfa58084cc7d7825b534600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061059f806100b56000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80632bd4da4114610051578063698996f81461006d5780637a20bae61461008b5780638da5cb5b146100a7575b600080fd5b61006b60048036038101906100669190610352565b6100c5565b005b61007561021b565b604051610082919061038e565b60405180910390f35b6100a560048036038101906100a09190610407565b610221565b005b6100af6102f3565b6040516100bc9190610443565b60405180910390f35b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166389f4dd47336040518263ffffffff1660e01b81526004016101229190610443565b602060405180830381600087803b15801561013c57600080fd5b505af1158015610150573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101749190610496565b9050806101b6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101ad90610520565b60405180910390fd5b60006002549050826002819055503373ffffffffffffffffffffffffffffffffffffffff167f82fdf47e6af8affef3b7c1e7025c8961b4d25ec7437f254b4d9100f1100171938260025460405161020e929190610540565b60405180910390a2505050565b60025481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146102af576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102a690610520565b60405180910390fd5b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600080fd5b6000819050919050565b61032f8161031c565b811461033a57600080fd5b50565b60008135905061034c81610326565b92915050565b60006020828403121561036857610367610317565b5b60006103768482850161033d565b91505092915050565b6103888161031c565b82525050565b60006020820190506103a3600083018461037f565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006103d4826103a9565b9050919050565b6103e4816103c9565b81146103ef57600080fd5b50565b600081359050610401816103db565b92915050565b60006020828403121561041d5761041c610317565b5b600061042b848285016103f2565b91505092915050565b61043d816103c9565b82525050565b60006020820190506104586000830184610434565b92915050565b60008115159050919050565b6104738161045e565b811461047e57600080fd5b50565b6000815190506104908161046a565b92915050565b6000602082840312156104ac576104ab610317565b5b60006104ba84828501610481565b91505092915050565b600082825260208201905092915050565b7f756e617574686f72697a65640000000000000000000000000000000000000000600082015250565b600061050a600c836104c3565b9150610515826104d4565b602082019050919050565b60006020820190508181036000830152610539816104fd565b9050919050565b6000604082019050610555600083018561037f565b610562602083018461037f565b939250505056fea2646970667358221220dc1c400050361b926ab931a060514e12a6ec61b48c08554527fb93acc87742bd64736f6c63430008090033";

    public static final String FUNC_CURRENTVALUE = "currentValue";

    public static final String FUNC_OWNER = "owner";

    public static final String FUNC_SETAUTHCONTRACT = "setAuthContract";

    public static final String FUNC_PROCESSTRANSACTION = "processTransaction";

    public static final Event VALUEUPDATED_EVENT = new Event("ValueUpdated", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Address>(true) {}, new TypeReference<Int256>() {}, new TypeReference<Int256>() {}));
    ;

    protected static final HashMap<String, String> _addresses;

    static {
        _addresses = new HashMap<String, String>();
        _addresses.put("98156", "0x17cB057648a03dE335c773C7F6b7719c63A32eB7");
    }

    @Deprecated
    protected DappBackend(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected DappBackend(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected DappBackend(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected DappBackend(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public List<ValueUpdatedEventResponse> getValueUpdatedEvents(TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = extractEventParametersWithLog(VALUEUPDATED_EVENT, transactionReceipt);
        ArrayList<ValueUpdatedEventResponse> responses = new ArrayList<ValueUpdatedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            ValueUpdatedEventResponse typedResponse = new ValueUpdatedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.by = (String) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.valueBefore = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.valueNow = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Flowable<ValueUpdatedEventResponse> valueUpdatedEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(new Function<Log, ValueUpdatedEventResponse>() {
            @Override
            public ValueUpdatedEventResponse apply(Log log) {
                Contract.EventValuesWithLog eventValues = extractEventParametersWithLog(VALUEUPDATED_EVENT, log);
                ValueUpdatedEventResponse typedResponse = new ValueUpdatedEventResponse();
                typedResponse.log = log;
                typedResponse.by = (String) eventValues.getIndexedValues().get(0).getValue();
                typedResponse.valueBefore = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
                typedResponse.valueNow = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
                return typedResponse;
            }
        });
    }

    public Flowable<ValueUpdatedEventResponse> valueUpdatedEventFlowable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(VALUEUPDATED_EVENT));
        return valueUpdatedEventFlowable(filter);
    }

    public RemoteFunctionCall<BigInteger> currentValue() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_CURRENTVALUE, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Int256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteFunctionCall<String> owner() {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(FUNC_OWNER, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<TransactionReceipt> setAuthContract(String contractAddress) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_SETAUTHCONTRACT, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(contractAddress)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> processTransaction(BigInteger number) {
        final org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                FUNC_PROCESSTRANSACTION, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Int256(number)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    @Deprecated
    public static DappBackend load(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new DappBackend(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static DappBackend load(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new DappBackend(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static DappBackend load(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return new DappBackend(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static DappBackend load(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new DappBackend(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static RemoteCall<DappBackend> deploy(Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(DappBackend.class, web3j, credentials, contractGasProvider, BINARY, "");
    }

    public static RemoteCall<DappBackend> deploy(Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(DappBackend.class, web3j, transactionManager, contractGasProvider, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<DappBackend> deploy(Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(DappBackend.class, web3j, credentials, gasPrice, gasLimit, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<DappBackend> deploy(Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(DappBackend.class, web3j, transactionManager, gasPrice, gasLimit, BINARY, "");
    }

    protected String getStaticDeployedAddress(String networkId) {
        return _addresses.get(networkId);
    }

    public static String getPreviouslyDeployedAddress(String networkId) {
        return _addresses.get(networkId);
    }

    public static class ValueUpdatedEventResponse extends BaseEventResponse {
        public String by;

        public BigInteger valueBefore;

        public BigInteger valueNow;
    }
}
