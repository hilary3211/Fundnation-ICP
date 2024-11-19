import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Types "./types";
import Text "mo:base/Text";
import List "mo:base/List";
import Time "mo:base/Time";


module {
  type NewUserProfile = Types.NewUserProfile;
  type NewProject = Types.NewProject;
  type Profile = Types.Profile;
  type Project = Types.Project;
  type ProjectId = Types.ProjectId;
  type ProjectStatus = Types.ProjectStatus;
  type UserId = Types.UserId;

type Donation = {
    donor: Principal;
    amount: Nat;
    timestamp: Time.Time;
     userimg :Text;
    userwords : Text;
    username : Text;
};

  public class Directory() {
  
    let userMapping = HashMap.HashMap<UserId, Profile>(1, isEqUserId, Principal.hash); 
    let projectMapping = HashMap.HashMap<ProjectId, Project>(1, isEqProjectId, Text.hash);
    let userToProjectsMapping = HashMap.HashMap<UserId, [ProjectId]>(1, isEqUserId, Principal.hash);
    let likeprojectMapping = HashMap.HashMap<UserId, [ProjectId]>(1, isEqUserId, Principal.hash);

   
    public func createOne(userId: UserId, profile: NewUserProfile) {
      userMapping.put(userId, makeProfile(userId, profile));
    };

    public func updateOne(userId: UserId, profile: Profile) {
      userMapping.put(userId, profile);
    };

    public func getUser(userId: UserId): ?Profile {
      userMapping.get(userId)
    };

    public func getMultipleUsers(userIds: [UserId]): [Profile] {
      func getProfile(userId: UserId): Profile {
        switch (userMapping.get(userId)) {
          case null {
            {
              bio = "";
              id = userId;
              img = "";
              email = "";
              firstName = "";
              lastName = "";
            };
          };
          case (?profile) { profile };
        };
      };
      Array.map<UserId, Profile>(userIds, getProfile)
    };

    public func findUserBy(term: Text): [Profile] {
      var profiles : Buffer.Buffer<Profile> = Buffer.Buffer<Profile>(1);
      for ((id, profile) in userMapping.entries()) {
        let fullName = profile.firstName # " " # profile.lastName;
        if (includesText(fullName, term)) {
          profiles.add(profile);
        };
      };
      profiles.toArray();
    };


    public func createProject(userId: UserId, newProject: NewProject): Project {
      let project = makeProject(userId, newProject);
      projectMapping.put(project.id, project);
      switch (userToProjectsMapping.get(userId)) {
        case (null) { userToProjectsMapping.put(userId, [project.id]); };
        case (?projects) { userToProjectsMapping.put(userId, Array.append<ProjectId>(projects, [project.id])); };
      };
      project;
    };



    // public func likeProject(userId: UserId, projectId: ProjectId): Project {
    //   let p = projectMapping.get(projectId);

    //    switch (p) {
    //     case null { };
    //     case (?project) {
    //        switch (likeprojectMapping.get(userId)) {
    //     case (null) { likeprojectMapping.put(userId, [project.id]); };
    //     case (?projects) { 
    //       Array.contains
    //       likeprojectMapping.put(userId, Array.append<ProjectId>(projects, [project.id]));
          
    //        };
    //   };
    //     };
    //   };
    //   project;
    // };




//     public func likeProject(userId: UserId, projectId: ProjectId) : ?Project {
//     // Retrieve the project using projectId from projectMapping
//     let projectOpt = projectMapping.get(projectId);

//     switch (projectOpt) {
//         // If the project does not exist, return null
//         case null { return null };
//         case (?project) {
//             // Check if the user already has a list of liked projects
//             switch (likeprojectMapping.get(userId)) {
//                 // If the user has no liked projects, initialize with the current projectId
//                 case null {
//                     likeprojectMapping.put(userId, [projectId]);
//                 };
//                 // If the user has liked projects, append the projectId if it doesn't already exist
//                 case (?projects) {
//                     let projectIndexOpt = Array.find<ProjectId>(projectId);
//                     if (projectIndexOpt) {
                    
//                     }else{
//                           let updatedProjects = Array.append<ProjectId>(projects, [projectId]);
//                         likeprojectMapping.put(userId, updatedProjects);
//                     }
//                 };
//             };
//             // Return the project after adding it to the liked list
//             return ?project;
//         };
//     };
// };



// public func likeProject(userId: UserId, projectId: ProjectId) : ?Project {
//     // Retrieve the project using projectId from projectMapping
//     let projectOpt = projectMapping.get(projectId);

//     switch (projectOpt) {
//         case (null) { }; // If the project does not exist, return null
//         case (?project) {
//             // Retrieve the user's liked projects
//             switch (likeprojectMapping.get(userId)) {
//                 // If the user has no liked projects, initialize with the current projectId
//                 case null {
//                     likeprojectMapping.put(userId, [projectId]);
//                 };
//                 // If the user has liked projects, append the projectId if it doesn't already exist
//                 case (?projects) {
//                     // Check if the projectId is already in the user's liked projects using indexOf
//                     let projectIndexOpt = Array.indexOf<ProjectId>(projectId, projects, isEqProjectId);

//                     // Only append if the projectId is not found (indexOf returns null if not found)
//                     switch (projectIndexOpt) {
//                         case null {
//                             let updatedProjects = Array.append<ProjectId>(projects, [projectId]);
//                             likeprojectMapping.put(userId, updatedProjects);
//                         };
//                         case (?_) { /* Project already liked, do nothing */ };
//                     };
//                 };
//             };
//             // Return the project after adding it to the liked list
//             return ?project;
//         };
//     };
// };



    public func deleteProject(projectId: ProjectId) : ?Project {
      let p = projectMapping.get(projectId);
      switch (p) {
        case null { };
        case (?project) {
          switch (userToProjectsMapping.get(project.owner)) {
            case null { };
            case (?projects) {
              func idsNotEqual (curId: ProjectId) : Bool { isEqProjectId(curId, projectId) != true };
              let newProjects = Array.filter<ProjectId>(projects, idsNotEqual);
              userToProjectsMapping.put(project.owner, newProjects);
            };
          };
        };
      };
      projectMapping.remove(projectId);
    };

    // public func unlikeProject(userId: UserId, projectId: ProjectId) : ?Project {
    //   let p = likeprojectMapping.get(projectId);
    //   switch (p) {
    //     case null { };
    //     case (?project) {
    //       switch (likeprojectMapping.get(userId)) {
    //         case null { };
    //         case (?projects) {
    //           func idsNotEqual (curId: ProjectId) : Bool { isEqProjectId(curId, projectId) != true };
    //           let newProjects = Array.filter<ProjectId>(projects, idsNotEqual);
    //           likeprojectMapping.put(project.owner, newProjects);
            
    //         };
    //       };
    //     };
    //   };
      
    // };


    public func getProject(projectId: ProjectId): ?Project {
      projectMapping.get(projectId)
    };

    public func getProjects(userId: UserId): [Project] {
      switch (userToProjectsMapping.get(userId)) {
        case (null) { [] };
        case (?projects) {
          func getProject(projectId: ProjectId): Project {
            switch (projectMapping.get(projectId)) {
              case null {
                {
                  category = "";
                  cover = "";
                  description = "";
                  //discordLink = "";
                  goal = 0;
                  id = projectId;
                  owner = userId;
                  projecttype = "";
                  status = null;
                  story = "";
                  tags = [];
                  title = "";
                  //twitterLink = "";
                  principalid= "";
                  raised = 0;
                  token = null;
                  donations= null;

                };
              };
              case (?project) { project };
            }
          };
          Array.map<ProjectId, Project>(projects, getProject)
        };
      };
    };

    public func listProjects() : [Project] {
      Iter.toArray(projectMapping.vals())
    };

    public func updateProject(project: Project) {
      projectMapping.put(project.id, project);
    };

    public func updateProjectStatus(project: Project, status: ProjectStatus) {
      projectMapping.put(project.id, {
        category = project.category;
        cover = project.cover;
        description = project.description;
        //discordLink = project.discordLink;
        goal = project.goal;
        id = project.id;
        //nftVolume = project.nftVolume;
        owner = project.owner;
        projecttype = project.projecttype;
        status = status;
        story = project.story;
        tags = project.tags;
        title = project.title;
        //twitterLink = project.twitterLink;
        principalid= project.principalid;
          raised = project.raised;
          token = project.token;
          donations= project.donations;
      });
    };


    public func getUserArray() : [(UserId, Profile)] {
      Iter.toArray(userMapping.entries())
    };

    public func getProjectArray() : [(ProjectId, Project)] {
      Iter.toArray(projectMapping.entries())
    };

    public func getUserToProjectArray() : [(UserId, [ProjectId])] {
      Iter.toArray(userToProjectsMapping.entries())
    };

    public func initializeUserMap(users: [(UserId, Profile)]) {
      for ((userId, profile) in users.vals()) {
        userMapping.put(userId, profile);
      };
    };

    public func initializeProjectMap(projects: [(ProjectId, Project)]) {
      for ((projectId, project) in projects.vals()) {
        projectMapping.put(projectId, project);
      };
    };

    public func initializeUserToProjectMap(userToProjects: [(UserId, [ProjectId])]) {
      for ((userId, projects) in userToProjects.vals()) {
        userToProjectsMapping.put(userId, projects);
      };
    };

    func makeProfile(userId: UserId, profile: NewUserProfile): Profile {
      {
        bio = profile.bio;
        firstName = profile.firstName;
        id = userId;
        email =  profile.email;
        img = profile.img;
        lastName = profile.lastName;
      }
    };

    public var projectIdGenerator : Nat = 0;
    public func makeProject(userId: UserId, project: NewProject): Project {
      projectIdGenerator += 1;
      {
        category = project.category;
        cover = project.cover;
        description = project.description;
        //discordLink = project.discordLink;
        goal = project.goal;
        id = Nat.toText(projectIdGenerator);
        //nftVolume = project.nftVolume;
        owner = userId;
        projecttype = project.projecttype;
        status = ?#submitted;
        story = project.story;
        tags = project.tags; 
        title = project.title;
         principalid= project.principalid;
          raised = project.raised;
          token = project.token;
          donations= project.donations;
        //twitterLink = project.twitterLink;
       // walletId = project.walletId;
         
      };
    };

    func includesText(string: Text, term: Text): Bool {
      let stringArray = Iter.toArray<Char>(string.chars());
      let termArray = Iter.toArray<Char>(term.chars());

      var i = 0;
      var j = 0;

      while (i < stringArray.size() and j < termArray.size()) {
        if (stringArray[i] == termArray[j]) {
          i += 1;
          j += 1;
          if (j == termArray.size()) { return true; }
        } else {
          i += 1;
          j := 0;
        }
      };
      false
    };

    public func textToNat(t : Text) : ?Nat {
      var i : Nat = 0;
      while (i <= projectIdGenerator) {
        if (t == Nat.toText(i)) { return ?i; };
        i += 1;
      };
      return null;
    };

  };

  func isEqUserId(x: UserId, y: UserId): Bool { x == y };
  func isEqProjectId(x: ProjectId, y: ProjectId): Bool { x == y };
};
    
