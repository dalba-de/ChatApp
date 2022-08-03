# ChatApp

## Una aplicación de chat para web
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white) ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

ChatApp es una aplicación completa de chat para navegador, compatible con PC y dispositivos móviles, ligera y adaptable a otros proyectos.
Creada con Angular, NestJS y Postgres.

## Características

- Permite chat grupales y privados.
- Usa los menús laterales para comunicarte con tus amigos o crear nuevos grupos.
- Puedes crear grupos públicos o protegidos mediante contraseña.
- ¡Alertas sonoras y visuales para que no te pierdas nada!.
- Datos persistentes gracias a la incorporación de bases de datos.

## Tecnología

ChatApp utiliza una serie de proyectos de código abierto para funcionar correctamente:
- [Angular](https://angular.io/) - Plataforma para construir modernas aplicaciones para mobiles y web.
- [Node](https://nodejs.org/es/) - Entorno de ejecucion para javascript, manejo de lógica de eventos I/O en el backend.
- [PostgreSQL](https://www.postgresql.org/) - La base de datos relacional de código abierto más avanzada del mundo.
- [Docker](https://www.docker.com/) - Plataforma de software que le permite crear, probar e implementar aplicaciones rápidamente.
- [Compose](https://docs.docker.com/compose/) - Compose es una herramienta para definir y ejecutar aplicaciones Docker de varios contenedores.

## Instalación
ChatApp requiere Docker y Compose para funcionar.

ChatApp es muy fácil de instalar y desplegar mediante el uso de Docker.

En primer lugar clona el repositorio en tu pc y entra en el directorio raiz:

```sh
cd ChatApp
```

Por defecto docker expone el puerto 4200 para el frontend y el 3000 para el backend. Puedes cambiarlos
en el dockerfile si lo consideras necesario. Cuando lo tengas todo listo usa compose y el archivo YML
que se incluye para iniciar el programa:

```sh
docker-compose up --build
```

Utiliza este comando la primera vez para descargar las imagenes de docker necesarias y crear las tuyas
propias desde los dockerfile. Para las siguientes ocasiones simplemente sera necesario:

```sh
docker-compose up
```

Verifica que todo funciona correctamente navegando a la dirección de tu servidor en el navegador de tu elección:

```sh
localhost:4200
```

Para administrar la base de datos, utiliza `postgres_admin` incluido en la instalación del archivo YML. Para ello 
dirigete en tu navegador a la dirección:

```sh
localhost:8080
```

Posteriormnente utiliza las credenciales incluidas en el archivo `api/src/app.module.ts`, o cambialas a otras de tu
elección.

## Ejemplo

