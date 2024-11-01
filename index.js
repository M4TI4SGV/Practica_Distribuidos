const { ApolloServer, gql } = require('apollo-server');

// Definir el esquema de GraphQL
const typeDefs = gql`
  type Libro {
    id: ID!
    titulo: String!
    autor: Autor!
  }

  type Autor {
    id: ID!
    nombre: String!
  }

  type Query {
    libros: [Libro]
    libro(id: ID!): Libro
    autores: [Autor]
  }

  type Mutation {
    agregarLibro(titulo: String!, autorId: ID!): Libro
  }
`;

// Datos de ejemplo
const autores = [
  { id: '1', nombre: 'Gabriel García Márquez' },
  { id: '2', nombre: 'Isabel Allende' },
];

const libros = [
  { id: '1', titulo: 'Cien años de soledad', autorId: '1' },
  { id: '2', titulo: 'La casa de los espíritus', autorId: '2' },
];

// Resolver funciones para las consultas y mutaciones
const resolvers = {
  Query: {
    libros: () => libros,
    libro: (parent, args) => libros.find(libro => libro.id === args.id),
    autores: () => autores,
  },
  Mutation: {
    agregarLibro: (parent, args) => {
      const nuevoLibro = {
        id: String(libros.length + 1),
        titulo: args.titulo,
        autorId: args.autorId,
      };
      libros.push(nuevoLibro);
      return nuevoLibro;
    },
  },
  Libro: {
    autor: (libro) => autores.find(autor => autor.id === libro.autorId),
  },
};

// Crear instancia de Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Iniciar el servidor
server.listen().then(({ url }) => {
  console.log(`Servidor listo en ${url}`);
});