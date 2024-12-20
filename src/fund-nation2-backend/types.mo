import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Curves "mo:bitcoin/ec/Curves";
import Nat              "mo:base/Nat";
import List "mo:base/List";
module {
  public type UserId = Principal;
  public type ProjectId = Text;
type Donation =  {
    donor: Principal;
    amount: Nat;
    timestamp: Time.Time;
    userimg :Text;
    userwords : Text;
    username : Text;
};

  // general types
  public type Image = [Int8];
  public type Link = Text;
  public type ProjectStatus = ?{ 
    #submitted;
    #approved; // approved submissions can be shown on frontend
    #whitelist;
    #live;
    #fully_funded;
  };

  public type NewUserProfile = {
    bio: Text;
    firstName: Text;
    img: Link;
    email : Text;
    lastName: Text;
  };

  public type Profile = {
    bio: Text;
    firstName: Text;
    id: UserId;
    img: Link;
    email : Text;
    lastName: Text;
  };

  public type NewProject = {
    category: Text;
    cover: Link;
    description: Text;
    goal: Nat;
    projecttype: Text;
    story: Text;
    tags: [Text]; 
    title: Text;
    principalid: Text;
    raised : Nat;
    token : ?{#iCP; #ckBTC; #petition};
    donations: ?List.List<Donation>;

  
  };

  public type Project = {
    category: Text;
    cover: Link;
    description: Text;
    goal: Nat;
    id: ProjectId;
    owner: UserId;
    projecttype: Text;
    status: ProjectStatus;
    story: Text;
    tags: [Text];
    title: Text;
     principalid: Text;
    raised : Nat;
    token : ?{#iCP; #ckBTC; #petition};
    donations: ?List.List<Donation>;
  };
  public type ProjectWithOwner = {
    project: Project;
    owner: Profile;
  };

  // Marketplace stuff
  public type MarketplaceLink = {
    #entrepot: Link;
    #ccc: Link;
    #other: Link;
  };

  public type MarketplaceLinks = [MarketplaceLink];


    public type AccountId           = Blob;
    public type AccountIdText       = Text;
    public type Subaccount          = Nat;
    public type SubaccountNat8Arr   = [Nat8];
    public type SubaccountBlob      = Blob;
    public type SubaccountStatus    = { 
        #empty;     // empty and waiting for a transfer
        #cancelled; // transfer has been cancelled
        #confirmed; // transfer has been confirmed by frontend, 
                    // now we need to check that we recieved the funds
        #funded;    // funds recieved
    };


    // LEDGER
    public type AccountBalanceArgs  = { account : AccountIdText };
    public type ICPTs               = { e8s     : Nat64     };
    public type SendArgs            = {
        memo            : Nat64;
        amount          : ICPTs;
        from_subaccount : ?SubaccountNat8Arr;
        to              : AccountIdText;
        created_at_time : Time.Time;
    };





























public type SendRequest = {
        destination_address : Text;
        amount_in_satoshi : Satoshi;
    };

    public type ECDSAPublicKeyReply = {
        public_key : Blob;
        chain_code : Blob;
    };

    public type EcdsaKeyId = {
        curve : EcdsaCurve;
        name : Text;
    };

    public type EcdsaCurve = {
        #secp256k1;
    };

    public type SignWithECDSAReply = {
        signature : Blob;
    };

    public type ECDSAPublicKey = {
        canister_id : ?Principal;
        derivation_path : [Blob];
        key_id : EcdsaKeyId;
    };

    public type SignWithECDSA = {
        message_hash : Blob;
        derivation_path : [Blob];
        key_id : EcdsaKeyId;
    };

    public type SchnorrKeyId = {
        algorithm : SchnorrAlgorithm;
        name : Text;
    };

    public type SchnorrAlgorithm = {
        #bip340secp256k1;
    };

    public type SchnorrPublicKeyArgs = {
        canister_id : ?Principal;
        derivation_path : [Blob];
        key_id : SchnorrKeyId;
    };

    public type SchnorrPublicKeyReply = {
        public_key : Blob;
        chain_code : Blob;
    };

    public type SignWithSchnorrArgs = {
        message : Blob;
        derivation_path : [Blob];
        key_id : SchnorrKeyId;
    };

    public type SignWithSchnorrReply = {
        signature : Blob;
    };

    public type Satoshi = Nat64;
    public type MillisatoshiPerVByte = Nat64;
    public type Cycles = Nat;
    public type BitcoinAddress = Text;
    public type BlockHash = [Nat8];
    public type Page = [Nat8];

    public let CURVE = Curves.secp256k1;

    /// The type of Bitcoin network the dapp will be interacting with.
    public type Network = {
        #mainnet;
        #testnet;
        #regtest;
    };

    /// The type of Bitcoin network as defined by the Bitcoin Motoko library
    /// (Note the difference in casing compared to `Network`)
    public type NetworkCamelCase = {
        #Mainnet;
        #Testnet;
        #Regtest;
    };

    public func network_to_network_camel_case(network : Network) : NetworkCamelCase {
        switch (network) {
            case (#regtest) {
                #Regtest;
            };
            case (#testnet) {
                #Testnet;
            };
            case (#mainnet) {
                #Mainnet;
            };
        };
    };

    /// A reference to a transaction output.
    public type OutPoint = {
        txid : Blob;
        vout : Nat32;
    };

    /// An unspent transaction output.
    public type Utxo = {
        outpoint : OutPoint;
        value : Satoshi;
        height : Nat32;
    };

    /// A request for getting the balance for a given address.
    public type GetBalanceRequest = {
        address : BitcoinAddress;
        network : Network;
        min_confirmations : ?Nat32;
    };

    /// A filter used when requesting UTXOs.
    public type UtxosFilter = {
        #MinConfirmations : Nat32;
        #Page : Page;
    };

    /// A request for getting the UTXOs for a given address.
    public type GetUtxosRequest = {
        address : BitcoinAddress;
        network : Network;
        filter : ?UtxosFilter;
    };

    /// The response returned for a request to get the UTXOs of a given address.
    public type GetUtxosResponse = {
        utxos : [Utxo];
        tip_block_hash : BlockHash;
        tip_height : Nat32;
        next_page : ?Page;
    };

    /// A request for getting the current fee percentiles.
    public type GetCurrentFeePercentilesRequest = {
        network : Network;
    };

    public type SendTransactionRequest = {
        transaction : [Nat8];
        network : Network;
    };

    public type SignFunction = (Text, [Blob], Blob) -> async Blob;
  





  




};
