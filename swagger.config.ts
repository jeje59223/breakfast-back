const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "BREAKFAST Documentation",
            version: "1.0.0",
            description: "Breakfast BACK END",
        },
        servers: [
            {
                url: "http://localhost:8080",
            },
        ],
        components: {
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            description: "Identifiant unique de l'utilisateur (ObjectId)",
                            example: "6482f5e1f4a1a2c3d5e9a0b7",
                        },
                        lastname: {
                            type: "string",
                            description: "Nom de l'utilisateur",
                            example: "Dupont",
                        },
                        firstname: {
                            type: "string",
                            description: "Prénom de l'utilisateur",
                            example: "Jean",
                        },
                        email: {
                            type: "string",
                            description: "Adresse e-mail de l'utilisateur",
                            example: "jean.dupont@example.com",
                        },
                        login: {
                            type: "object",
                            properties: {
                                username: {
                                    type: "string",
                                    description: "Nom d'utilisateur pour la connexion",
                                    example: "jdupont",
                                },
                                password: {
                                    type: "string",
                                    description: "Mot de passe de l'utilisateur (hashé)",
                                    example: "password123",
                                },
                            },
                        },
                        picture: {
                            type: "string",
                            description: "URL de la photo de l'utilisateur",
                            nullable: true,
                            example: "https://example.com/photos/jdupont.jpg",
                        },
                        roles: {
                            type: "array",
                            items: {
                                type: "string",
                                enum: ["ADMIN", "USER"],
                            },
                            description: "Liste des rôles attribués à l'utilisateur",
                            example: ["USER"],
                        },
                        numberOfBreakFastOrganised: {
                            type: "integer",
                            description: "Nombre de petits déjeuners organisés par l'utilisateur",
                            example: 5,
                        },
                        nextOrganizedBreakfastDate: {
                            type: "string",
                            format: "date-time",
                            description: "Date du prochain petit déjeuner organisé par l'utilisateur",
                            nullable: true,
                            example: "2024-12-01T08:00:00Z",
                        },
                        creationDate: {
                            type: "string",
                            format: "date-time",
                            description: "Date de création de l'utilisateur",
                            example: "2023-01-15T12:34:56Z",
                        },
                        ldap: {
                            type: "string",
                            description: "Identifiant LDAP de l'utilisateur",
                            example: "jdupont",
                        },
                    },
                    required: ["_id", "lastname", "firstname", "email", "login", "roles", "numberOfBreakFastOrganised", "creationDate", "ldap"],
                },
            },
        },
        paths: {},
    },
    apis: ["./src/routes/users/*.ts"], // Le chemin vers tes fichiers de routes
};

export default swaggerOptions;
