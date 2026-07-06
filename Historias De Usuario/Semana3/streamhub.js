// ======================================
// PROYECTO MONGODB - STREAMHUB
// ======================================

streamhub

// ======================================
// TASK 2 - INSERCIÓN DE DATOS
// ======================================

// Usuario inicial
db.usuarios.insertOne({
    nombre: "Juan",
    correo: "juan@gmail.com",
    edad: 21,
    pais: "Colombia",
    plan: "Premium",
    historial: [
        { contenido: "Interestelar", progreso: 100 },
        { contenido: "Avatar", progreso: 100 },
        { contenido: "Titanic", progreso: 100 },
        { contenido: "Joker", progreso: 100 },
        { contenido: "Breaking Bad", progreso: 100 },
        { contenido: "Dark", progreso: 100 }
    ]
})

// Más usuarios
db.usuarios.insertMany([
{
    nombre: "Maria",
    correo: "maria@gmail.com",
    edad: 24,
    pais: "México",
    plan: "Basico",
    historial: [
        { contenido: "Avatar", progreso: 100 },
        { contenido: "Dark", progreso: 100 }
    ]
},
{
    nombre: "Carlos",
    correo: "carlos@gmail.com",
    edad: 30,
    pais: "Perú",
    plan: "Premium",
    historial: [
        { contenido: "Joker", progreso: 100 }
    ]
}
])

// Contenidos
db.contenidos.insertMany([
{
    titulo: "Interestelar",
    tipo: "Pelicula",
    genero: ["Ciencia Ficcion","Drama"],
    duracion: 169,
    anio: 2014
},
{
    titulo: "Avatar",
    tipo: "Pelicula",
    genero: ["Accion","Aventura"],
    duracion: 162,
    anio: 2009
},
{
    titulo: "Titanic",
    tipo: "Pelicula",
    genero: ["Drama"],
    duracion: 194,
    anio: 1997
},
{
    titulo: "Joker",
    tipo: "Pelicula",
    genero: ["Drama"],
    duracion: 122,
    anio: 2019
},
{
    titulo: "Breaking Bad",
    tipo: "Serie",
    genero: ["Drama","Crimen"],
    temporadas: 5,
    anio: 2008
},
{
    titulo: "Dark",
    tipo: "Serie",
    genero: ["Misterio"],
    temporadas: 3,
    anio: 2017
}
])

// Valoraciones
db.valoraciones.insertMany([
{
    usuario: "Juan",
    contenido: "Interestelar",
    calificacion: 5,
    comentario: "Excelente"
},
{
    usuario: "Juan",
    contenido: "Avatar",
    calificacion: 4,
    comentario: "Muy buena"
},
{
    usuario: "Maria",
    contenido: "Dark",
    calificacion: 5,
    comentario: "Increíble"
},
{
    usuario: "Carlos",
    contenido: "Joker",
    calificacion: 3,
    comentario: "Regular"
}
])

// Lista de favoritos
db.listas.insertOne({
    usuario: "Juan",
    nombre: "Favoritas",
    contenidos: [
        "Interestelar",
        "Breaking Bad",
        "Dark"
    ]
})

// ======================================
// TASK 3 - CONSULTAS
// ======================================

// Películas con duración mayor a 120 minutos
db.contenidos.find({
    duracion: { $gt: 120 }
})

// Películas con duración menor a 170 minutos
db.contenidos.find({
    duracion: { $lt: 170 }
})

// Usuarios Premium
db.usuarios.find({
    plan: { $eq: "Premium" }
})

// Contenidos Drama o Acción
db.contenidos.find({
    genero: {
        $in: ["Drama","Accion"]
    }
})

// Usuarios mayores de 20 años y Premium
db.usuarios.find({
    $and: [
        { edad: { $gt: 20 } },
        { plan: "Premium" }
    ]
})

// Usuarios Premium o Básico
db.usuarios.find({
    $or: [
        { plan: "Premium" },
        { plan: "Basico" }
    ]
})

// Contenidos cuyo título inicia con A
db.contenidos.find({
    titulo: {
        $regex: "^A"
    }
})

// Usuarios con más de 5 contenidos vistos
db.usuarios.find({
    $expr: {
        $gt: [
            { $size: "$historial" },
            5
        ]
    }
})

// ======================================
// TASK 4 - ACTUALIZACIONES
// ======================================

// Cambiar plan de María
db.usuarios.updateOne(
    { nombre: "Maria" },
    {
        $set: {
            plan: "Premium"
        }
    }
)

// Agregar disponibilidad a películas
db.contenidos.updateMany(
    { tipo: "Pelicula" },
    {
        $set: {
            disponible: true
        }
    }
)

// Actualizar calificación de Carlos
db.valoraciones.updateOne(
    { usuario: "Carlos" },
    {
        $set: {
            calificacion: 5
        }
    }
)

// ======================================
// ELIMINACIONES
// ======================================

// Eliminar valoración de Carlos
db.valoraciones.deleteOne({
    usuario: "Carlos"
})

// Eliminar usuarios menores de edad
db.usuarios.deleteMany({
    edad: {
        $lt: 18
    }
})

// ======================================
// TASK 5 - ÍNDICES
// ======================================

// Índice por título
db.contenidos.createIndex({
    titulo: 1
})

// Índice por género
db.contenidos.createIndex({
    genero: 1
})

// Índice por correo
db.usuarios.createIndex({
    correo: 1
})

// Ver índices
db.contenidos.getIndexes()

db.usuarios.getIndexes()

// ======================================
// TASK 6 - AGREGACIONES
// ======================================

// Promedio de calificaciones por contenido
db.valoraciones.aggregate([
{
    $group: {
        _id: "$contenido",
        promedioCalificacion: { $avg: "$calificacion" },
        totalValoraciones: { $sum: 1 }
    }
},
{
    $sort: {
        promedioCalificacion: -1
    }
}
])

// Cantidad de contenidos vistos por usuario
db.usuarios.aggregate([
{
    $unwind: "$historial"
},
{
    $group: {
        _id: "$nombre",
        totalVistos: { $sum: 1 }
    }
},
{
    $project: {
        _id: 0,
        usuario: "$_id",
        totalVistos: 1
    }
},
{
    $sort: {
        totalVistos: -1
    }
}
])

// Cantidad de películas por género
db.contenidos.aggregate([
{
    $unwind: "$genero"
},
{
    $match: {
        tipo: "Pelicula"
    }
},
{
    $group: {
        _id: "$genero",
        cantidadPeliculas: { $sum: 1 }
    }
},
{
    $project: {
        _id: 0,
        genero: "$_id",
        cantidadPeliculas: 1
    }
},
{
    $sort: {
        cantidadPeliculas: -1
    }
}
])