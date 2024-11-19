import Array "mo:base/Array";
import Database "./database";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Types "./types";

import Blob   "mo:base/Blob";
import Nat8     "mo:base/Nat8";
import Nat32    "mo:base/Nat32";
import Hex      "./hex";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";

import Prelude "mo:base/Prelude";
import Text "mo:base/Text";





module {
  type NewUserProfile = Types.NewUserProfile;
  type Profile = Types.Profile;
  type Project = Types.Project;
  type ProjectId = Types.ProjectId;
  type ProjectWithOwner = Types.ProjectWithOwner;
  type UserId = Types.UserId;

  // Profiles

  public func getProfile(db: Database.Directory, userId: UserId): Profile {
    let existing = db.getUser(userId);
    switch (existing) {
      case (?existing) { existing };
      case (null) {
        {
          bio = "";
          firstName = "";
          email= "";
          id = userId;
          img = "";
          lastName = "";
        }
      };
    };
  };

  // Projects

  public func getProject(db: Database.Directory, projectId: ProjectId): Project {
    let existing = db.getProject(projectId);
    switch (existing) {
      case (?existing) { existing };
      case (null) {
        {
          category = "";
          cover = "";
          description = "";
          goal = 0;
          id = "";
          owner = Principal.fromText("");
          projecttype = "";
          status= null;
          story = "";
          tags = [];
          title = "";
        principalid= "";
        raised = 0;
        token = null;
        donations= null;
        }
      };
    };
  };

  public func getProjectWithOwner(db: Database.Directory, p: Project): ProjectWithOwner {
    {
      project =p;
      owner = getProfile(db, p.owner);
    }
  };

  // Connections

  public func includes(x: UserId, xs: [UserId]): Bool {
    func isX(y: UserId): Bool { x == y };
    switch (Array.find<UserId>(xs, isX)) {
      case (null) { false };
      case (_) { true };
    };
  };

  // Authorization

  let adminIds: [Text] = [
    "2vxsx-fae",
    "wtkui-xuevj-vgwgg-7dpi4-sctrc-drivq-56y4y-m76vg-i4ki4-2urmf-vae"
  ];

  public func isAdmin(userId: UserId): Bool {
    func identity(x: Text): Bool { x == Principal.toText(userId) };
    Option.isSome(Array.find<Text>(adminIds,identity))
  };

  public func hasAccess(userId: UserId, profile: Profile): Bool {
    userId == profile.id or isAdmin(userId)
  };

  public func hasProjectAccess(userId: UserId, project: Project): Bool {
    userId == project.owner or isAdmin(userId)
  };


  type AccountId = Types.AccountId;
    type AccountIdText = Types.AccountIdText;
    type Subaccount = Types.Subaccount;
    type SubaccountBlob = Types.SubaccountBlob;
    type SubaccountNat8Arr = Types.SubaccountNat8Arr;

    // Account helpers 

    public func accountIdToHex (a : AccountId) : AccountIdText {
        Hex.encode(Blob.toArray(a));
    };

    public func hexToAccountId (h : AccountIdText) : AccountId {
        Blob.fromArray(Hex.decode(h));
    };    

    public func defaultSubaccount () : SubaccountBlob {
        Blob.fromArrayMut(Array.init(32, 0 : Nat8))
    };

    public func natToBytes (n : Nat) : [Nat8] {
        nat32ToBytes(Nat32.fromNat(n));
    };

    public func nat32ToBytes (n : Nat32) : [Nat8] {
        func byte(n: Nat32) : Nat8 {
            Nat8.fromNat(Nat32.toNat(n & 0xff))
        };
        [byte(n >> 24), byte(n >> 16), byte(n >> 8), byte(n)]
    };

    public func subToSubBlob (sub : Subaccount) : SubaccountBlob {
        let n_byte = func(i : Nat) : Nat8 {
            assert(i < 32);
            let shift : Nat = 8 * (32 - 1 - i);
            Nat8.fromIntWrap(sub / 2**shift)
        };
        Blob.fromArray(Array.tabulate<Nat8>(32, n_byte))
    };

    public func subBlobToSubNat8Arr (sub : SubaccountBlob) : SubaccountNat8Arr {
        let subZero : [var Nat8] = [var 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        let subArray = Blob.toArray(sub);
        let sizeDiff = subZero.size()-subArray.size();
        var i = 0;
        while (i < subZero.size()) {
            if (i >= sizeDiff) {
                subZero[i] := subArray[i - sizeDiff];
            };
            i += 1;
        };
        Array.freeze<Nat8>(subZero);
    };




     type Result<Ok, Err> = Result.Result<Ok, Err>;

    /// Returns the value of the result and traps if there isn't any value to return.
    public func get_ok<T>(result : Result<T, Text>) : T {
        switch result {
            case (#ok value)
                value;
            case (#err error)
                Debug.trap("pattern failed: " # error);
        }
    };

    /// Returns the value of the result and traps with a custom message if there isn't any value to return.
    public func get_ok_expect<T>(result : Result<T, Text>, expect : Text) : T {
        switch result {
            case (#ok value)
                value;
            case (#err error) {
                Debug.trap(expect # " pattern failed: " # error);
            };
        }
    };
      /// Returns the value of the result and traps if there isn't any value to return.

    // type Result<Ok, Err> = Result.Result<Ok, Err>;

    
    public func get_ok2<T, U>(result : Result<T, U>) : T {
        switch result {
            case (#ok value)
                value;
            case (#err error)
                Debug.trap("pattern failed");
        }
    };

    /// Returns the value of the result and traps with a custom message if there isn't any value to return.
    public func get_ok_except2<T, U>(result : Result<T, U>, expect : Text) : T {
        switch result {
            case (#ok value)
                value;
            case (#err error) {
                Debug.print("pattern failed");
                Debug.trap(expect);
            };
        }
    };

     /// Unwraps the value of the option.
    public func unwrap<T>(option : ?T) : T {
        switch option {
            case (?value)
                value;
            case null
                Prelude.unreachable();
        }
    };

    // Returns the hexadecimal representation of a `Nat8` considered as a `Nat4`.
    func nat4ToText(nat4 : Nat8) : Text {
        Text.fromChar(switch nat4 {
            case 0 '0';
            case 1 '1';
            case 2 '2';
            case 3 '3';
            case 4 '4';
            case 5 '5';
            case 6 '6';
            case 7 '7';
            case 8 '8';
            case 9 '9';
            case 10 'a';
            case 11 'b';
            case 12 'c';
            case 13 'd';
            case 14 'e';
            case 15 'f';
            case _ Prelude.unreachable()

        })
    };

    /// Returns the hexadecimal representation of a `Nat8`.
    func nat8ToText(byte : Nat8) : Text {
        let leftNat4 = byte >> 4;
        let rightNat4 = byte & 15;
        nat4ToText(leftNat4) # nat4ToText(rightNat4)
    };

    /// Returns the hexadecimal representation of a byte array.
    public func bytesToText(bytes : [Nat8]) : Text {
        Text.join("", Iter.map<Nat8, Text>(Iter.fromArray(bytes), func (n) { nat8ToText(n) }))
    };




    // /// A mock for rubber-stamping 64B ECDSA/BIP340 signatures.
    public func mock_signer(_key_name : Text, _derivation_path : [Blob], _message_hash : Blob) : async Blob {
      Blob.fromArray(Array.freeze(Array.init<Nat8>(64, 255)));
    };
};

