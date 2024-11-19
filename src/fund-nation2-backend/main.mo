import Array            "mo:base/Array";
import Debug            "mo:base/Debug";
import Database         "./database";
import Error            "mo:base/Error";
import Iter             "mo:base/Iter";
import Nat              "mo:base/Nat";
import Principal        "mo:base/Principal";
import Text             "mo:base/Text";
import Trie             "mo:base/Trie";
import Account          "./account";
import Result           "mo:base/Result";
import Types            "./types";
import Utils            "./utils";
import Nat64            "mo:base/Nat64";
import Time             "mo:base/Time";
import Buffer           "mo:base/Buffer";
import ckBTC             "canister:ckbtc_ledger";
import Blob "mo:base/Blob";
import BitcoinApi "BitcoinApi";
import BitcoinWallet "BitcoinWallet";
import P2pkh "P2pkh";
import P2trRawKeySpend "P2trRawKeySpend";
import P2trScriptSpend "P2trScriptSpend";
import ICPLedger    "canister:ledger";
import List "mo:base/List";
import Float "mo:base/Float";
import Prim "mo:⛔";
import Nat8 "mo:base/Nat8";




actor FundNation  { 
    type NewUserProfile = Types.NewUserProfile;
    type NewProject = Types.NewProject;
    type Profile = Types.Profile;
    type Project = Types.Project;
    type ProjectId = Types.ProjectId;
    type ProjectStatus = Types.ProjectStatus;
    type ProjectWithOwner = Types.ProjectWithOwner;
    type UserId = Types.UserId;

    type EMProjectId = Nat;
    type EMCanisterId = Principal; 

    stable var users        : [(UserId, Profile)]               = [];
    stable var projects     : [(ProjectId, Project)]            = [];
    stable var userProjects : [(UserId, [ProjectId])]           = [];
    stable var nextProject  : Nat                               = 0;

    // Main database
    var db: Database.Directory = Database.Directory();





  type GetUtxosResponse = Types.GetUtxosResponse;
  type MillisatoshiPerVByte = Types.MillisatoshiPerVByte;
  type SendRequest = Types.SendRequest;
  type Network = Types.Network;
  type BitcoinAddress = Types.BitcoinAddress;
  type Satoshi = Types.Satoshi;
  type TransactionId = Text;

// _network : Types.Network
  // The Bitcoin network to connect to.
  //
  // When developing locally this should be `regtest`.
  // When deploying to the IC this should be `testnet`.
  // `mainnet` is currently unsupported.
  stable let NETWORK : Network = #regtest;//#regtest;

  // The derivation path to use for ECDSA secp256k1.
  let DERIVATION_PATH : [[Nat8]] = [];

  // The ECDSA key name.
  let KEY_NAME : Text = switch NETWORK {
    // For local development, we use a special test key with dfx.
    case (#regtest) "dfx_test_key";
    // On the IC we're using a test ECDSA key.
    case _ "test_key_1";
  };

  /// Returns the balance of the given Bitcoin address.
  public func get_balance(address : BitcoinAddress) : async Satoshi {
    await BitcoinApi.get_balance(NETWORK, address);
  };

  /// Returns the UTXOs of the given Bitcoin address.
  public func get_utxos(address : BitcoinAddress) : async GetUtxosResponse {
    await BitcoinApi.get_utxos(NETWORK, address);
  };

  /// Returns the 100 fee percentiles measured in millisatoshi/vbyte.
  /// Percentiles are computed from the last 10,000 transactions (if available).
  public func get_current_fee_percentiles() : async [MillisatoshiPerVByte] {
    await BitcoinApi.get_current_fee_percentiles(NETWORK);
  };

  /// Returns the P2PKH address of this canister at a specific derivation path.
  public func get_p2pkh_address() : async BitcoinAddress {
    await P2pkh.get_address(NETWORK, KEY_NAME, DERIVATION_PATH);
  };

  /// Sends the given amount of bitcoin from this canister to the given address.
  /// Returns the transaction ID.
  public func send_from_p2pkh_address(request : SendRequest) : async TransactionId {
    Utils.bytesToText(await P2pkh.send(NETWORK, DERIVATION_PATH, KEY_NAME, request.destination_address, request.amount_in_satoshi));
  };

  public func get_p2tr_raw_key_spend_address() : async BitcoinAddress {
    await P2trRawKeySpend.get_address(NETWORK, KEY_NAME, DERIVATION_PATH);
  };

  public func send_from_p2tr_raw_key_spend_address(request : SendRequest) : async TransactionId {
    Utils.bytesToText(await P2trRawKeySpend.send(NETWORK, DERIVATION_PATH, KEY_NAME, request.destination_address, request.amount_in_satoshi));
  };

  public func get_p2tr_script_spend_address() : async BitcoinAddress {
    await P2trScriptSpend.get_address(NETWORK, KEY_NAME, DERIVATION_PATH);
  };

  public func send_from_p2tr_script_spend_address(request : SendRequest) : async TransactionId {
    Utils.bytesToText(await P2trScriptSpend.send(NETWORK, DERIVATION_PATH, KEY_NAME, request.destination_address, request.amount_in_satoshi));
  };


 /// Sends the given amount of bitcoin from this canister to the given address.
  /// Returns the transaction ID.
  public func send(request : SendRequest) : async Text {
    Utils.bytesToText(await BitcoinWallet.send(NETWORK, DERIVATION_PATH, KEY_NAME, request.destination_address, request.amount_in_satoshi))
  };

















    // Upgrade functions
    system func preupgrade() {
        users           := db.getUserArray();
        projects        := db.getProjectArray();
        userProjects    := db.getUserToProjectArray();
        nextProject     := db.projectIdGenerator;
    };

    system func postupgrade() {
        db.initializeUserMap(users);
        db.initializeProjectMap(projects);
        db.initializeUserToProjectMap(userProjects);
        db.projectIdGenerator := nextProject;
        Debug.print(Nat.toText(nextProject));
        users := [];
        projects := [];
        userProjects := [];
    };
    
    type Date = Text;
    stable var launchDates : Trie.Trie<ProjectId, Date> = Trie.empty();
    func eqDate (a: Date, b: Date) : Bool { a == b };
    func getProjectIdkey (pid: ProjectId) : Trie.Key<ProjectId> {
        { key = pid; hash = Text.hash(pid); };
    };
    public shared(msg) func putLaunchDate(pid: ProjectId, date: Date) : async () {
        assert(Utils.isAdmin(msg.caller));
        launchDates := Trie.put<ProjectId, Date>(launchDates, getProjectIdkey(pid), eqDate, date).0;
    };
    public query func getLaunchDate(pid: ProjectId) : async ?Date {
        Trie.get<ProjectId, Date>(launchDates, getProjectIdkey(pid), eqDate);
    };

    // public func healthcheck(): async Bool { true };

    // public shared(msg) func greet(): async Text {
    //     "Hello " # Utils.getProfile(db, msg.caller).firstName # "!"
    // };


    public shared query(msg) func getMyProfile(): async Profile {
        Utils.getProfile(db, msg.caller)
    };

    public shared(msg) func createProfile(profile: NewUserProfile): async () {
        db.createOne(msg.caller, profile);
    };

    public shared(msg) func adminCreateProfile(principal: Principal, profile: NewUserProfile): async () {
        assert(Utils.isAdmin(principal));
        db.createOne(principal, profile);
    };

    public shared(msg) func updateProfile(profile: Profile): async () {
        if(Utils.hasAccess(msg.caller, profile)) {
            db.updateOne(profile.id, profile);
        };
    };

    public query func getProfile(userId: UserId): async Profile {
        Utils.getProfile(db, userId)
    };

    public query func searchProfiles(term: Text): async [Profile] {
        db.findUserBy(term)
    };

    public shared query(msg) func getMyProjects() : async [Project] {
        db.getProjects(msg.caller)
    };

    public shared(msg) func createFirstProject(profile: NewUserProfile, project: NewProject): async Project {
        db.createOne(msg.caller, profile);
        db.createProject(msg.caller, project);
    };

    public shared(msg) func createProject(project: NewProject): async Project {
        db.createProject(msg.caller, project)
    };

    // public shared(msg) func likeProject(userId: UserId, projectId: ProjectId): async Project {
    //     db.likeProject(msg.caller, project)
    // };

    public shared(msg) func adminCreateProject(principal: Principal, project: NewProject): async Project {
        assert(Utils.isAdmin(msg.caller));
        db.createProject(principal, project)
    };

    public shared(msg) func updateProject(project: Project): async () {
        assert(Utils.hasProjectAccess(msg.caller, project));
        assert(Utils.isAdmin(msg.caller));
        db.updateProject(project);
    };

    public shared(msg) func deleteProject(projectId: ProjectId): async ?Project {
        assert(Utils.hasProjectAccess(msg.caller, await getProject(projectId)));
        db.deleteProject(projectId);
    };

    // public shared(msg) func unlikeProject(userId: UserId, projectId: ProjectId): async ?Project {
    //     db.unlikeProject(userId, projectId);
    // };
    public query func getProject(projectId: ProjectId): async Project {
        Utils.getProject(db, projectId)
    };

    public query func getProjectWithOwner(projectId: ProjectId): async ProjectWithOwner {
        Utils.getProjectWithOwner(db, Utils.getProject(db, projectId))
    };

    // public query func getProjectWithOwnerAndMarketplace(projectId: ProjectId): async {
    //     project: Project; owner: Profile; marketplaceLinks: MarketplaceLinks;
    // } {
    //     let pAndO = Utils.getProjectWithOwner(db, Utils.getProject(db, projectId));
    //     switch(_getMarketplaceLinks(projectId)) {
    //         case (?links) { { project = pAndO.project; owner = pAndO.owner; marketplaceLinks = links; } };
    //         case (null) { { project = pAndO.project; owner = pAndO.owner; marketplaceLinks = []; }; };
    //     };
    // };

    public query func getProjects(userId: UserId): async [Project] {
        db.getProjects(userId)
    };

    public query func listProjects(statuses: [ProjectStatus]): async [ProjectWithOwner] {
        func getProjectWithOwner(p: Project) : ProjectWithOwner { 
            Utils.getProjectWithOwner(db, p);
        };
        let projectsWithOwners = Array.map(db.listProjects(), getProjectWithOwner);
        switch (statuses.size()) { 
            case 0 { projectsWithOwners };
            case _ { Array.filter(projectsWithOwners, func (p: ProjectWithOwner) : Bool { 
                switch(Array.find(statuses, func (s: ProjectStatus) : Bool { s == p.project.status })) {
                    case null { false };
                    case _ { true };
                };
            }); 
            };
        };
    };

public query func listProjects2(): async [ProjectWithOwner] {
    func getProjectWithOwner(p: Project): ProjectWithOwner {
        Utils.getProjectWithOwner(db, p);
    };
    // Map over all projects in the database and get each project's owner
    let projectsWithOwners = Array.map(db.listProjects(), getProjectWithOwner);
    
    // Return all projects with owners
    projectsWithOwners;
};

    

    public shared(msg) func approveProject(pid: ProjectId): async () {
        assert(Utils.isAdmin(msg.caller));
        switch (db.getProject(pid)) {
            case (?p) { 
                assert(p.status == ?#submitted);
                db.updateProjectStatus(p, ?#approved);
            };
            case null { throw Error.reject("No project with this id.") };
        };
    };

        public shared(msg) func launchProject(pid: ProjectId): async () {
        assert(Utils.isAdmin(msg.caller));
        switch (db.getProject(pid)) {
            case (?p) { 
                assert(p.status == ?#approved);
                db.updateProjectStatus(p, ?#live);
            };
            case null { throw Error.reject("No project with this id.") };
        };
    };

    

    public shared(msg) func unapproveProject(pid: ProjectId): async () {
        assert(Utils.isAdmin(msg.caller));
        switch (db.getProject(pid)) {
            case (?p) { 
                assert(p.status == ?#approved);
                db.updateProjectStatus(p, ?#submitted);
            };
            case null { throw Error.reject("No project with this id.") };
        }; 
    };

    public shared(msg) func closeProject(pid: ProjectId) : async () {
        assert(Utils.isAdmin(msg.caller));
        switch (db.getProject(pid)) {
            case (?p) { 
                assert(p.status == ?#whitelist or p.status == ?#live);
                db.updateProjectStatus(p, ?#approved);
            };
            case null { throw Error.reject("No project with this id.") };
        }; 
    };

    public shared(msg) func setProjectFullyFunded(pid: ProjectId): async () {
        assert(Utils.isAdmin(msg.caller));
        switch (db.getProject(pid)) {
            case (?p) { 
                assert(p.status == ?#whitelist or p.status == ?#live);
                db.updateProjectStatus(p, ?#fully_funded);
            };
            case null { throw Error.reject("No project with this id.") };
        };
    };

    public shared(msg) func archiveProject(pid: ProjectId): async () {
        assert(Utils.isAdmin(msg.caller));
        switch (db.getProject(pid)) {
            case (?p) { 
                assert(p.status == ?#whitelist or p.status == ?#live);
                db.updateProjectStatus(p, null);
            };
            case null { throw Error.reject("No project with this id.") };
        };
    };

    stable var whitelists   : Trie.Trie<ProjectId, [Principal]> = Trie.empty();

    // public query func getWhitelist(pid: ProjectId): async [Principal] {
    //     _getWhitelist(pid);
    // };
    // public shared(msg) func addWhitelist(pid: ProjectId, principals: [Principal]): async () {
    //     //assert(Utils.isAdmin(msg.caller));
    //     switch (Trie.get<ProjectId, [Principal]>(whitelists, projectIdKey(pid), Text.equal)) {
    //         case (?ps) {
    //             let newPs = Array.append<Principal>(ps, principals);
    //             whitelists := Trie.put<ProjectId, [Principal]>(whitelists, projectIdKey(pid), pidsAreEqual, newPs).0;
    //         };
    //         case null {
    //             whitelists := Trie.put<ProjectId, [Principal]>(whitelists, projectIdKey(pid), pidsAreEqual, principals).0;
    //         };
    //     };
    // };
    // public shared(msg) func resetWhitelist(pid: ProjectId): async () {
    //     assert(Utils.isAdmin(msg.caller));
    //     whitelists := Trie.put<ProjectId, [Principal]>(whitelists, projectIdKey(pid), pidsAreEqual, []).0;
    // };

    type ProjectState = {
        #whitelist: [Principal];
        #live;
        #closed;
        #noproject;
    };
    public query func getProjectState(pid: ProjectId) : async ProjectState {
        switch (db.getProject(pid)) {
            case (?p) {
                switch (p.status) {
                    case (?#whitelist) {
                        let whitelist = _getWhitelist(pid);
                        #whitelist(whitelist);
                    };
                    case (?#live) {
                        #live;
                    };
                    case _ {
                        #closed;
                    };
                };
            };
            case null { #noproject };
        };
    };

    func _getWhitelist(pid: ProjectId) : [Principal] {
        switch (Trie.get<ProjectId, [Principal]>(whitelists, projectIdKey(pid), Text.equal)) {
            case (?principals) { principals;};
            case null { return []; };
        };
    };

    func pidsAreEqual(p1: ProjectId, p2: ProjectId) : Bool { p1 == p2 };
    func projectIdKey (p: ProjectId) : Trie.Key<ProjectId> {
        { key = p; hash = Text.hash(p) };
    };


    type MarketplaceLinks = Types.MarketplaceLinks;
    stable var marketplaceLinks : Trie.Trie<ProjectId, MarketplaceLinks> = Trie.empty();

    
    

type Donation =  {
    donor: Principal;
    amount: Nat;
    timestamp: Time.Time;
    userimg :Text;
    userwords : Text;
    username : Text;
};


func calculateFee(amount : Nat) : Nat {
    let fee = (amount * 2) / 100;
    Nat.max(fee, 1)
};

    public shared({ caller }) func contribute( projectId: ProjectId, amount : Nat, userimg : Text , userwords : Text, username : Text) : async Result.Result<Text, Text> {
        let campaignOpt = db.getProject(projectId); // You need to implement this function to retrieve campaign details
       let canisterId = Principal.fromText("aaaaa-aa");
        switch (campaignOpt) {
        case (null) {
            return #err("Project not found");
        };
        case (?campaign) {
            let fee = calculateFee(amount);
            let transferAmount  = amount - fee;

            switch (campaign.token) {
            case (null) {
                    return #err("Project token type is not set");
                };
            case (?#petition) {
                 let donation: Donation = {
                                donor = caller;
                                amount = amount;
                                timestamp = Time.now();
                                userimg = userimg;
                                userwords = userwords;
                                username = username;
                            };
                        
                           
                            let updatedCampaign : Project = {
                                        projecttype = campaign.projecttype;
                                        principalid = campaign.principalid;
                                        status = campaign.status;
                                        story = campaign.story;
                                        tags = campaign.tags;
                                        title = campaign.title;
                                        category = campaign.category;
                                        cover = campaign.cover;
                                        description = campaign.description;
                                        id = campaign.id;
                                        owner = campaign.owner;
                                        goal = campaign.goal;
                                        raised = campaign.raised + donation.amount;
                                        token = campaign.token;
                                        donations = switch (campaign.donations) {
                                            case (null) {
                                                ?List.push<Donation>(donation, List.nil<Donation>())
                                            };
                                            case (?existingDonations) {
                                                ?List.push<Donation>(donation, existingDonations)
                                            };
                                        };
                                    };
                            db.updateProject(updatedCampaign);
                            #ok("Petition signed successfully") 
            };
            case (?#iCP) {
                let transferArgs : ICPLedger.TransferArg = {
                   to = { owner = canisterId; subaccount = ?generateSubaccount(projectId) };
                    fee = ?10_000;
                    memo = null;
                    from_subaccount = null;
                    created_at_time = null;
                    amount = transferAmount;
                };
                try {
                    let transferResult = await ICPLedger.icrc1_transfer(transferArgs);
                    switch (transferResult) {
                        case (#Err(transferError)) { #err("Couldn't transfer ICP: " # debug_show(transferError)) };
                        case (#Ok(blockIndex)) { 
                            let donation: Donation = {
                                donor = caller;
                                amount = amount;
                                timestamp = Time.now();
                                userimg = userimg;
                                userwords = userwords;
                                username = username;
                            };
                        
                           
                            let updatedCampaign : Project = {
                                        projecttype = campaign.projecttype;
                                        principalid = campaign.principalid;
                                        status = campaign.status;
                                        story = campaign.story;
                                        tags = campaign.tags;
                                        title = campaign.title;
                                        category = campaign.category;
                                        cover = campaign.cover;
                                        description = campaign.description;
                                        id = campaign.id;
                                        owner = campaign.owner;
                                        goal = campaign.goal;
                                        raised = campaign.raised + donation.amount;
                                        token = campaign.token;
                                        donations = switch (campaign.donations) {
                                            case (null) {
                                                ?List.push<Donation>(donation, List.nil<Donation>())
                                            };
                                            case (?existingDonations) {
                                                ?List.push<Donation>(donation, existingDonations)
                                            };
                                        };
                                    };
                            db.updateProject(updatedCampaign);
                            #ok("ICP contribution successful") 
                        };
                    }
                } catch (error : Error) { #err("ICP transfer error: " # Error.message(error)) }
            };
          

            case (?#ckBTC) {
                let transferArgs : ckBTC.TransferArg = {
                    to = { owner = canisterId; subaccount = ?generateSubaccount(projectId) };
                    fee = ?10_000;
                    memo = null;
                    from_subaccount = null;
                    created_at_time = null;
                    amount = transferAmount;
                };
                try {
                    let transferResult = await ckBTC.icrc1_transfer(transferArgs);
                    switch (transferResult) {
                        case (#Err(transferError)) { #err("Couldn't transfer ckBTC: " # debug_show(transferError)) };
                        case (#Ok(blockIndex)) { 
                            // Update campaign raised amount

                             let donation: Donation = {
                                donor = caller;
                                amount = amount;
                                timestamp = Time.now();
                                userimg = userimg;
                                userwords = userwords;
                                username = username;
                            };
                        
                        
                           let updatedCampaign : Project = {
                                        projecttype = campaign.projecttype;
                                        principalid = campaign.principalid;
                                        status = campaign.status;
                                        story = campaign.story;
                                        tags = campaign.tags;
                                        title = campaign.title;
                                        category = campaign.category;
                                        cover = campaign.cover;
                                        description = campaign.description;
                                        id = campaign.id;
                                        owner = campaign.owner;
                                        goal = campaign.goal;
                                        raised = campaign.raised + donation.amount;
                                        token = campaign.token;
                                        donations = switch (campaign.donations) {
                                            case (null) {
                                                ?List.push<Donation>(donation, List.nil<Donation>())
                                            };
                                            case (?existingDonations) {
                                                ?List.push<Donation>(donation, existingDonations)
                                            };
                                        };
                                    };
                            db.updateProject(updatedCampaign);
                            #ok("ckBTC contribution successful") 
                        };
                    }
                } catch (error : Error) { #err("ckBTC transfer error: " # Error.message(error)) }
            };
            }
        };
    }
      
    };





public func convertDonationsToArray(donations: ?List.List<Donation>) : async [Donation] {
    switch (donations) {
        case (null) { [] };
        case (?list) { List.toArray(list) };
    };
};
       



    public shared({ caller }) func withdrawFunds( projectId: ProjectId, to : Principal) : async Result.Result<Text, Text> {
        let campaignOpt = db.getProject(projectId);
       
        switch (campaignOpt) {
                    case (null) {
                        return #err("Project not found");
                    };
                    case (?campaign) {
                    if (caller != campaign.principalid) { return #err("Only campaign owner can withdraw funds") };
                    //if (campaign.raised < campaign.goal) { return #err("Funding goal not reached") };

                    let amount = campaign.raised;
                    let fee = calculateFee(amount); // 2% fee
                    let transferAmount = amount - fee;




                    switch (campaign.token) {
                        case (null) {
                            return #err("Project token type is not set");
                        };
                       
                         
                        case (?#iCP) {
                            let transferArgs : ICPLedger.TransferArg = {
                                to = { owner = to; subaccount = null };
                                fee = ?10_000; // 0.0001 ICP
                                memo = null;
                                from_subaccount = ?generateSubaccount(projectId);
                                created_at_time = null;
                                amount = transferAmount;
                   
                            };
                            try {
                                let transferResult = await ICPLedger.icrc1_transfer(transferArgs);
                                switch (transferResult) {
                                    case (#Err(transferError)) { #err("Couldn't transfer ICP: " # debug_show(transferError)) };
                                    case (#Ok(blockIndex)) { #ok("ICP withdrawal successful") };
                                }
                            } catch (error : Error) { #err("ICP withdrawal error: " # Error.message(error)) }
                        };
                        case (?#ckBTC) {
                            let transferArgs : ckBTC.TransferArg = {
                                to = { owner = to; subaccount = null };
                                fee = ?10_000;
                                memo = null;
                                from_subaccount = ?generateSubaccount(projectId);
                                created_at_time = null;
                                amount = transferAmount;
                            };
                            try {
                                let transferResult = await ckBTC.icrc1_transfer(transferArgs);
                                switch (transferResult) {
                                    case (#Err(transferError)) { #err("Couldn't transfer ckBTC: " # debug_show(transferError)) };
                                    case (#Ok(blockIndex)) { #ok("ckBTC withdrawal successful") };
                                }
                            } catch (error : Error) { #err("ckBTC withdrawal error: " # Error.message(error)) }
                        };
                        case (?#petition) {
                            #ok("Petition Sign successful")
                        };
                    }
                    };
        }
    };



// public query func getCampaignStats(projectId: ProjectId,) : async {totalDonors: Nat; totalRaised: Nat; donationCount: Nat} {
//    let campaign = db.getProject(projectId);
//     let uniqueDonors = List.fold<Donation, Set.Set<Principal>>(campaign.donations, Set.empty(), func(acc, donation) {
//         Set.insert(acc, donation.donor, Principal.hash, Principal.equal)
//     });
//     {
//         totalDonors = Set.size(uniqueDonors);
//         totalRaised = campaign.raised;
//         donationCount = List.size(campaign.donations);
//     }
// };






// func recordDonation(campaign: Campaign, donation: Donation) : Campaign {
//     {
//         id = campaign.id;
//         owner = campaign.owner;
//         goal = campaign.goal;
//         raised = campaign.raised + donation.amount;
//         token = campaign.token;
//         donations = List.push(donation, campaign.donations);
//     }
// }

















type Subaccount = Blob;
// type Account2 = {
//         owner : Principal;
//         subaccount : ?Subaccount;
//     };



private func generateSubaccount(id: Text) : Subaccount {
    let idBytes = Blob.toArray(Text.encodeUtf8(id));
    let padding = Array.freeze(Array.init<Nat8>(32 - idBytes.size(), 0));
    let subaccount = Array.append<Nat8>(padding, idBytes);
    Blob.fromArray(subaccount)
};



//     // Function to create a new account for a campaign
//     public func createCampaignAccount(principal: Principal, campaignId : Text) : async Account2 {
//         let subaccount = generateSubaccount(campaignId);
//         {
//             owner = principal;
//             subaccount = ?subaccount;
//         }
//     };

//     // Function to check balance of a campaign
//     public func checkCampaignBalance(account : Account2) : async Nat {
//         await ckBTC.icrc1_balance_of(account)
//     };

//     // Function to transfer ckBTC from a campaign to a recipient
//     public shared(msg) func transferFromCampaign(campaignId : Text, to : Account2, amount : Nat) : async Result.Result<Nat, Text> {
//         let fromSubaccount = generateSubaccount(campaignId);
//         let transferArgs : ckBTC.TransferArg = {
//             from_subaccount = ?fromSubaccount;
//             to = to;
//             amount = amount;
//             fee = null;
//             memo = null;
//             created_at_time = null;
//         };

//         try {
//             let transferResult = await ckBTC.icrc1_transfer(transferArgs);
//             switch (transferResult) {
//                 case (#Err(transferError)) {
//                     #err("Couldn't transfer funds: " # debug_show(transferError))
//                 };
//                 case (#Ok(blockIndex)) {
//                     #ok(blockIndex)
//                 };
//             }
//         } catch (error : Error) {
//             #err("Reject message: " # Error.message(error))
//         }
//     };

// public func getCampaignDepositAddress(principal: Principal, campaignId : Text) : async Text {
//     let account : Account2 = {
//         owner = principal;
//         subaccount = ?generateSubaccount(campaignId);
//     };
    
//     // Convert the account to a standard ICRC-1 format
//     let accountText = Principal.toText(account.owner) # ":" # 
//         (switch (account.subaccount) {
//             case (null) "0000000000000000000000000000000000000000000000000000000000000000";
//             case (?subaccount) blobToHex(subaccount);
//         });
    
//     accountText
// };

// // Helper function to convert Blob to hexadecimal string
// func blobToHex(blob: Blob) : Text {
//     let hex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
//     let arr = Blob.toArray(blob);
//     let buf = Buffer.Buffer<Text>(arr.size() * 2);
//     for (byte in arr.vals()) {
//         buf.add(hex[Nat8.toNat(byte / 16)]);
//         buf.add(hex[Nat8.toNat(byte % 16)]);
//     };
//     Text.join("", buf.vals());
// };


















    func _getMarketplaceLinks(pid: ProjectId): ?MarketplaceLinks {
        Trie.get<ProjectId, MarketplaceLinks>(marketplaceLinks, projectIdKey(pid), Text.equal);
    };

    public shared query(msg) func getOwnId(): async UserId { msg.caller };

    // public shared query(msg) func getOwnIdText(): async Text { Principal.toText(msg.caller) };

    public shared query(msg) func isAdmin(): async Bool {
        Utils.isAdmin(msg.caller)
    };
    
    // type AccountBalanceArgs = Types.AccountBalanceArgs;  // defining datatypes
    // type ICPTs = Types.ICPTs;
    // type SendArgs = Types.SendArgs;

    // let FEE : Nat64 = 5_000;
    // let FundNation_ACCOUNT = "4b6e014d31a72553145ec82b62f9275a7b4a02e093ac98444ea8a0ccad195c52";


    // // You need to input the ledger canister thats created
    // let Ledger = actor "bnz7o-iuaaa-aaaaa-qaaaa-cai" : actor { 
    //     send_dfx : shared SendArgs -> async Nat64;
    //     account_balance_dfx : shared query AccountBalanceArgs -> async ICPTs; //ledger canister
    // };
    // func getPrincipal () : Principal {
    //     return Principal.fromActor(FundNation);
    // };
    // func pay_func(amount : Nat64, projectId : ProjectId) : async (){
    //     let defaultAccountId = Account.getAccountId(getPrincipal(), Utils.defaultSubaccount());
    //     let ledger_id = Principal.fromText("bnz7o-iuaaa-aaaaa-qaaaa-cai");
    //     let ledger_acc = Account.getAccountId(ledger_id, Utils.defaultSubaccount());

    //     func destruct() : async Text {
    //         let userdets = Utils.getProject(db, projectId);
    //         let {category; cover;  description;goal;id;owner;projecttype;status;story;tags;title;walletId} = userdets;
    //         return walletId;
    //     };
    //     let walletid = await destruct();
    //     let trans = await Ledger.send_dfx({
    //         memo = Nat64.fromNat(0); 
    //         from_subaccount = ?Utils.subBlobToSubNat8Arr(defaultAccountId);
    //         to = Utils.accountIdToHex(Account.getAccountId(ledger_id,Utils.defaultSubaccount()));
    //         amount = {e8s = amount};
    //         created_at_time = Time.now();
    //     });
    //     let trans1 = await Ledger.send_dfx({
    //         memo = Nat64.fromNat(2); 
    //         from_subaccount = ?Utils.subBlobToSubNat8Arr(ledger_acc);
    //         to = walletid;
    //         amount = {e8s = amount - FEE} ;
    //         created_at_time = Time.now();
    //     });
    //     let trans2 = await Ledger.send_dfx({
    //         memo = Nat64.fromNat(0); 
    //         from_subaccount = ?Utils.subBlobToSubNat8Arr(ledger_acc);
    //         to = FundNation_ACCOUNT;
    //         amount = {e8s = amount - FEE} ;
    //         created_at_time = Time.now();

    //     });
    // };
    // public func pay(amount : Nat64, projectId : ProjectId) {
    //     let pay = await pay_func(amount,projectId);

    // };

};




