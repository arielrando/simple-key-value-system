# simple-key-value-system
Test made for Media Monks challenge 

# English

## Requirements

You need to have Node.js installed on your computer and set the environment variable to it

## Starting the project

Open a console pointing to the folder where the project is, execute the command "npm i" to install all the necessary dependencies, then execute the command "npm start" to start the project, it will open in the url http: // localhost: 8080 /, if you need to use a different port you can change it from the ./index.js file on line 28

## Interaction with the project

Once the project is open in a browser, the first thing you will see is a login form, by default a user is generated which is "monkadmin" with the password "Cellphone717", use them to enter.

Once inside the system you will be able to see the text on the home page of the site with the instructions of what to do, on the left there will be a menu where you can access the different parts of the site.

The keys/values part is simple to understand, in the list you can see all the created keys/values and from there you can create new ones, modify or delete existing ones

The users section is similar, but its creation and modification form have 2 details; The first is that when a user is created or modified, its "authorization level" can be set, this determines the actions that it can perform in the system (the definition of each level can be seen in the form itself).

The second thing is that when a user is modified it is not necessary to re-enter their password, you only have to enter if you want to modify it

## REST endpoint

It is also possible to consult the Keys/Values from an endpoint:

To see all the key/values you must call the url http://localhost: 8080/api/keyvalue

To consult the value of a specific key, you must enter http://localhost:8080/api/keyvalue/'key', where 'key' would be the key that we want to consult. If we enter a key that does not exist, we will be returned an error message and a 404 status

## Technical considerations

The challenge indicates that the creation and modification of keys/values should be done through websocket, this is possible and also if the site is opened from different browsers (or private sessions), when a modification of a key / value is made This modification can be seen in real time, if it is a creation or elimination, it will be notified in the other instance of said change.

Another thing to note is that the management of users is carried out in another way (through fetch) to vary the form of communication between the frontend and the backend.

Finally, indicate that the management of data persistence, both keys/values, users and the session itself can be changed between 2 engines: sqlite and firestore. By default sqlite is used but it can be changed to firestore by modifying the DBdefault parameter in line 2 of the ./config.js file (Take into account that to use firestore as a database engine you must have the .env file in the root of the project, which contains the firestore credentials. For security reasons, it is not attached but you can request it or ask me how to set it using your credentials)

# Español

## Requerimientos

Se necesita tener instalado Node.js en su equipo y seteado la variable de entorno al mismo

## Iniciando el proyecto

Abra una consola apuntando a la carpeta donde esta el proyecto, ejecute el comando "npm i" para instalar todas las dependencias necesarias, luego ejecute el comando "npm start" para iniciar el proyecto, el mismo se abrira en la url http://localhost:8080/, si necesita usar un puerto distinto puede cambiarlo desde el archivo ./index.js en la linea 28

## Interacción con el proyecto

Una vez este el proyecto abierto en un explorador, lo primero que vera es un formulario de logueo, por default se genera un usuario el cual es "monkadmin" con la contraseñá "Cellphone717", uselas para ingresar.

Una vez dentro del sistema podra observar el texto en el home del sitio con las instrucciones de que hacer, a la izquierda estara un menu donde se puede acceder a las distintas partes del sitio.

La parte de keys/values es simple de entender, en la lista podra ver todas las key/value creadas y desde ahi puede crear nuevas, modificar o eliminar existetntes

La sección de usuarios es similar, pero su formulario de creacion y modificacion cuentan con 2 detalles; El primero es que cuando se crea o modifica un usuario se puede setear su "nivel de autorizacion", este determina las acciones que el mismo puede realizar en el sistema (la definicion de cada nivel se puede ver en el formulario mismo).

Lo segundo es que cuando se modifica un usuario no hace falta volver a ingresar su contraseña, solo de debe ingresar si se desea modificarla.

## REST endpoint

También es posible consultar las Keys/Values desde un endpoint:

Para ver todas las key/value se debe llamar a la url http://localhost:8080/api/keyvalue

Para consultar el value de una key en especifico se  debe ingresar a http://localhost:8080/api/keyvalue/'key', en donde 'key' iria la key que deseamos consultar. si ingresamos una key que no existe se nos devolvera un mensaje de error y un status 404

## Consideraciones técnicas

en el desafio se indica que la creacion y modificacion de keys/values se debian hacer por medio de websocket, esto es posible y tambien si se abre el sitio desde distintos navegadores (o sesiones privadas), al realizarse una modificacion de una key/value se podra ver en tiempo real esta modificacion, si se trata de una creacion o eliminacion, se avisara en la otra instancia de dicho cambion

Otra cosa a apuntar es que el manejo de los usuarios esta llevado de otra manera (por medio de fetch) para variar la forma de comunicacion entre el frontend y el backend.

Por ultimo indicar que el manejo de la persistencia de datos tanto keys/values, usuarios y la sesion misma puede ser cambiada entre 2 motores: sqlite y firestore. Por default se usa sqlite pero se puede cambiar a firestore modificando el parametro DBdefault en la linea 2 del archivo ./config.js (tengan en cuenta que para usar firestore como motor de base de datos se debe tener el archivo .env en el raiz del proyecto, el cual contiene las credenciales de firestore. Por temas de seguridad no el mismo no esta adjuntado pero pueden solicitarmelo o pedirme como setearlo usando sus credenciales)
