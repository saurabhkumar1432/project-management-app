const { projects,clients } = require('../sampleData.js');

//mongoose models
const Project = require('../models/Project');
const Client = require('../models/Client'); 




const { GraphQLObjectType,GraphQLString, GraphQLSchema, GraphQLID, GraphQLList } = require('graphql');



//project type


const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: ()=>({
        id: {type: GraphQLID},
        name : {type: GraphQLString},
        description : {type: GraphQLString},
        status : {type: GraphQLString},
        Client: {
            type: ClientType,
            resolve(parent,args){
            return Client.findById(parent.clientId);
            }
        },

    })
});


//client type

const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: ()=>({
        id: {type: GraphQLID},
        name : {type: GraphQLString},
        email : {type: GraphQLString},
        phone : {type: GraphQLString},
       

    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent,args){
               return Client.find();
            },
        },
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID}},
            resolve(parent,args){
                return Client.findById(args.id);
             },
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent,args){
               return Project.find();
            },
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID}},
            resolve(parent,args){
                return Project.findById(args.id);
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery
})