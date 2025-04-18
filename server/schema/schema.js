
//mongoose models
const Project = require('../models/Project');
const Client = require('../models/Client');

const { GraphQLObjectType,GraphQLString, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require('graphql');

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

//project type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: ()=>({
        id: {type: GraphQLID},
        name : {type: GraphQLString},
        description : {type: GraphQLString},
        status : {type: GraphQLString},
        client: {
            type: ClientType,
            resolve(parent,args){
                return Client.findById(parent.clientId);
            }
        },
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

//Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addClient: {
            type: ClientType,
            args: {
                name: {type: GraphQLNonNull( GraphQLString)},
                email: {type: GraphQLNonNull( GraphQLString)},
                phone: {type: GraphQLNonNull( GraphQLString)},
            },
            resolve(parent,args){
                let client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });
                return client.save();
            }
        },
        deleteClient: {
            type: ClientType,
            args: {
                id: {type: GraphQLID},
            },
            resolve(parent,args){
                Project.find({ clientId: args.id }).then((projects) => {
                    projects.forEach((project) => {
                      project.deleteOne();
                    });
                  });
                return Client.findByIdAndDelete(args.id);
            }
        },
        updateClient: {
            type: ClientType,
            args: {
                id: {type: GraphQLID},
                name: {type: GraphQLString},
                email: {type: GraphQLString},
                phone: {type: GraphQLString},
            },
            resolve(parent,args){
                return Client.findByIdAndUpdate(args.id,{
                    $set: {
                        name: args.name,
                        email: args.email,
                        phone: args.phone,
                    }
                },{new: true});
            }
        },

        addProject: {
            type: ProjectType,
            args: {
                name: {type: GraphQLNonNull( GraphQLString)},
                description: {type: GraphQLNonNull( GraphQLString)},
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values:{
                            'new': {value: 'Not Started'},
                            'progress': {value: 'In Progress'},
                            'completed': {value: 'Completed'},
                        }
                    }),
                    defaultValue: 'Not Started'
                },
                clientId: {type: GraphQLNonNull( GraphQLID)},
            },
            resolve(parent,args){
                let project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                });
                return project.save();
            }
        },
        deleteProject: {
            type: ProjectType,
            args: {
                id: {type: GraphQLID},
            },
            resolve(parent,args){
                return Project.findByIdAndDelete(args.id);
            }
        },
        updateProject: {
            type: ProjectType,
            args: {
                id: {type: GraphQLID},
                name: {type: GraphQLString},
                description: {type: GraphQLString},
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values:{
                            'new': {value: 'Not Started'},
                            'progress': {value: 'In Progress'},
                            'completed': {value: 'Completed'},
                        }
                    }),
                },
                clientId: {type: GraphQLID},
            },
            resolve(parent,args){
                return Project.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            description: args.description,
                            status: args.status,
                            clientId: args.clientId,
                        },
                    },
                    {new: true}
                );
            }
        },
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})