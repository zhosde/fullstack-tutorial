const { gql } = require('apollo-server');

const typeDefs = gql`
  type Launch {
  id: ID!
  site: String
  mission: Mission
  rocket: Rocket
  isBooked: Boolean!
}

type Rocket {
  id: ID!
  name: String
  type: String
}

type User {
  id: ID!
  email: String!
  trips: [Launch]!
  token: String
}

type Mission {
  name: String
  missionPatch(size: PatchSize): String
}

enum PatchSize {
  SMALL
  LARGE
}

type Query {
  "only return results after cursor"
  launches(pageSize: Int after: String): LaunchConnection!
  launch(id: ID!): Launch
  me: User
}

type LaunchConnection {
"indicating current position in data set"
    cursor: String!
"indicating whether data set contains more items beyond those included in launches"
    hasMore: Boolean!
    launches: [Launch]!
}

type Mutation {
  bookTrips(launchIds: [ID]!): TripUpdateResponse!
  cancelTrip(launchId: ID!): TripUpdateResponse!
  login(email: String): User
}

type TripUpdateResponse {
  success: Boolean!
  message: String
  launches: [Launch]
}



`;

module.exports = typeDefs;

